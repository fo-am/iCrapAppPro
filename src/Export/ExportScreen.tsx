import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { translate } from "react-i18next";
import {
  Alert,
  Dimensions,
  FlatList,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Input } from "react-native-elements";
import RNFS from "react-native-fs";
import Mailer from "react-native-mail";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import { database } from "../database/Database";
import styles from "../styles/style";

import Farm from "../model/Farm";
import { CrapAppExport } from "./exportModel";
// import data from "./farm.json";

import { generateSecureRandom } from "react-native-securerandom";
const Aes = NativeModules.Aes;
import ImportFileCheck from "../Export/ImportFileCheck";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  FarmStore: FarmStore;
  CalculatorStore: CalculatorStore;
  SettingsStore: SettingsStore;
}

interface State {
  area: any;
  mapMoveEnabled: boolean;
  showSave: boolean;
  showDraw: boolean;
  showHaveProps: boolean;
  resultString: string;
  password: string;
  farmKey: string | undefined;
  textEncode: string;
  enableImport: boolean;
}

@translate(["common"], { wait: true })
@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class ExportScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
    this.state = {
      password: "crapapp",
      resultString: "",
      enableImport: false
    };

    this.requestFileWritePermission();
  }

  public componentWillMount() {
    const { navigation, FarmStore, FieldStore } = this.props;
    const item = navigation.getParam("farmKey", undefined);
    if (item) {
      this.setState({ farmKey: item });
    } else {
      this.setState({ farmKey: undefined });
    }
    this.ImportEnable();
  }

  public render() {
    const {
      FieldStore,
      CalculatorStore,
      SettingsStore,
      FarmStore,
      navigation
    } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ImportFileCheck navigation={navigation} />
        <ScrollView>
          <View>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={this.handleEmail}
              title={"Send csv data to " + SettingsStore.appSettings.email}
            />

            <Input
              selectTextOnFocus={true}
              label="Enter A Password"
              labelStyle={styles.text}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              onChangeText={text => this.setState({ password: text })}
              placeholder="crapapp"
              secureTextEntry={true}
            >
              {this.state.password}
            </Input>
            <Button
              disabled={this.state.enableImport}
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.importJson()}
              title={"Import Data"}
            />

            <Button
              disabled={this.state.farmKey === undefined}
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() =>
                this.exportField(this.state.farmKey, this.state.password)
              }
              title={"Send Farm"}
            />
          </View>
          <Text>{this.state.resultString}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
  private async ImportEnable() {
    RNFS.exists(RNFS.DocumentDirectoryPath + "/Inbox/FarmsData.json.enc").then(
      exists => this.setState({ enableImport: !exists })
    );
  }

  private async decrypt(text: string, password: string): Promise<string> {
    const importStrings = text.split(":");

    //   const saltbytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //  const salt = String.fromCharCode.apply(null, saltbytes);
    const salt = importStrings[0];
    const iv = importStrings[1];
    const payload = importStrings[3];

    const longkey = await Aes.pbkdf2(this.state.password, salt, 10000, 384);

    const confidentialityKey = longkey.substring(0, 32);
    const integretykey = longkey.substring(32, 96);

    try {
      return await Aes.decrypt(payload, confidentialityKey, iv).then(
        farmJson => {
          return farmJson;
        }
      );
    } catch (exc) {
      if (
        exc instanceof Error &&
        (exc.message.includes("BAD_DECRYPT") ||
          exc.message.includes("Decrypt failed"))
      ) {
        //  console.log("bad decrypt");
      }

      throw exc;
    }
  }

  private async exportField(farmKey: string, password: string) {
    // get data from database and put it into the json format
    // encrypt the json
    // email the json
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;

    database.exportFarm(farmKey).then(async farm => {
      const saltbytes = await generateSecureRandom(128);
      let salt64 = this.Base64.encode(
        String.fromCharCode.apply(null, saltbytes)
      );

      const ivbytes = await generateSecureRandom(16);
      let iv64 = this.Base64.encode(String.fromCharCode.apply(null, ivbytes));

      let longkeyBytes: string = await Aes.pbkdf2(password, salt64, 10000, 384);
      //   longkeyBytes =
      //    "72f0865c2437b716f792788db6119aa39e01e23ec5a9c2679b145617b5139ab9c08fc486b9d6f3a6648b97b9a429efae";
      // conf key is 16 bytes in Java... 32 here?
      const confidentialityKey = longkeyBytes.substring(0, 32);
      const integretykey = longkeyBytes.substring(32, 96);

      const encrypted64 = await Aes.encrypt(
        JSON.stringify(farm),
        confidentialityKey,
        iv64
      );

      //    const bytes = [0];
      //  const bytestring = String.fromCharCode.apply(null, bytes);
      const mac = await Aes.hmac256(
        //  "00",
        //  "27820820c44013ca8314fb5bd49927d84885e6d53d12df77b307fd4f10a500c1"
        //  "dccc28a52f12e8a10f728ac4bae5b1c6ffa74155242f0cd50ebf599ed56ebf5ddc0bbf597d84b4a39b2b1029f64318a4b372c91bedf2e62c9a2bc5df44356483c42b5ef6f2748cf05d356fddc2316d429d6893699dde817b8289aa04d83475d77f31f3dc1d8a94a183236ab6f6b20373d90bda38cb440ad5b70da9d25b3408eaebe64d3abd2c4c606af2efb0c9f6c546bd5a26bae13b34b6453072999860d8960ee1b7068950031352e84ca1f533d9c98e89cce22a8575aec13776484f6c8e6c749228508c46fee8cd073c618ad99bc4c033ba4e64b41b96a8411c3ffec92558341f820bae03f434b043c79bcdac897f64fdc061abedf1cb773963d41bdb9d9d5f8837e627ac08b70472585f99d96b7ec346ea6c9bad65796014af37263542bccc2c5f047ebc5c91aed83ec99d3c42173ff0a0e32a04b39b332fce26a174d38c92a00b65a18a76d35bd5c5a84555d1abea84aac34de6c250db7e67ef485c83f65f522b5ba66210ae908fe86333bb312983eaa91570969c7c0c244666984bb4eee445fc8f03a156e3322555d4ff36c936da4587c70a372fa7d8b1dba7b76237739786b39781856025b56c5e99b548692f75a50c741dbe2c00a5b486b52dae9c078a5fdaeec5c7c2fd90c4a3b593b82d19133ef74c37351b8b4c9caef915bf5a49ee6fa0b6b563832b5193d9aa7543757c330f9a76cd616ea5e542ab792fbd9166d3abb35c951f53819b351853ade779765b670d2883b6f584cbe30f1b211449f24eb088184bec48fff9124c2aa11b2b3744407437be9318f74e04989b5bccc67c32731accae2f2cd9f135f3e94a6e4039b6d11d4f06e3a0615131a242fc59e556958966f1738c84c69aa18a9aa2c3fc1ac79973718ef8354803395b0cceea5d80c57665bcea032cce6442ad5e07e596e9d791a010ff886ce09c228351719ac27d46201fda29d95367e4a73e868cdb600aa30b3486615ddcb79f04ce9b1096c4133f9de5511a576f7afdb8d2f3b3a6c73d18fcd92f7a01769d258f53e93c2e41aa0ac8ecb13f69ec88f1e326dca67866c06daf1c40c5eaa14dca5e5dbfe1d1429144a0a122dc29ecb00ddafb9c36c9da152819685390c42f4532579904a39d3d3835a73c8a4ed28adf6f1dbe31b01edb781ab5189adfa0ec50ecc3c1cbf17065381af03e00413da3fe2e6e0401c29f0e3eed1b4133a369a4659240b31471642dcf9d8ce6c2adb406d09b483247200924e345c7ea784806eeae00acb6c0a1071593b3b9cda7ddc7e7d0d368b751615acac2525bbc57a2cc9b706dd15a58504a5dea67daccc3bf60105d70216cfe1c9ab8486dda3dda5eb504c31e64a6cf105a493ead0044b99e8d490da57ac31c19f8a3d146a2a5621aeb468e8cda82c5da5a2f67f165721ff2c6dc01141c8f3246bae7731c6c06583b79fbda5e69f19c0f5e48d95eb28829aaa993800418f10093460156ccbb2ab62f569bd2fab11ae132dd35a2803ccb9a0b490291abbf474304380e197d42ff74a2f9ff44f44547d60bd7e0529ba39c1a3236dd358b23c61e9be9cdfacd901f52ef8f0a7b28b9d4b55c9da2611fd65ce0761cda3e2912c3fd8b6ea1d4cdc04e3dac951db59573d153484aa8bc3eb416ee53f689c752ec6e11d7344c333cfb201ccfa5a579665d1946ac613923131f5aba5195d88045d18fbc2fde45640f38394c54a4de8c5895816996cef143b2e6e761d2b13f1bb7a1709faf905e0b0804cac515bedddb63385c1899d32f043e381fc459a3cedcad587770131b3e3d6122ca5f007651684a021d536ce7344b6d547e10cea98ec5e7724c92fdce65ab61750292f6478e43a09a9ceaa5261793addecccd01e6a4a90b8490330fee9a1b9d0e6947f891f71665be2863eb4d022fec1631dd0d162c349177159a58e1a676db46704f02eb4350c3902a12e6200554290d6896c71c4dd6a6180930e8d968e598b25c1b006dbe80bf650b92ca6b90b7f92949ae98304267ad3d6afca211069304751fd229a9416045818b64c7f01f334a70e42f79a95099a496e03b384eb636538d435de4dc9c726a4d21cca6606f0e8467ad39034a70ffb3f56b61445603f574d1fa5b7d656df0b1219426b4f59c2d712a745954c3da815d73f23b5931d0b272e1c09d6bf7f38654ac0bdccbb257149a4d37db4b41e5f1d13f0c41f287a9b514d5cc92dd8eb37deb2ca75b618c186b276f7c36d0a057d651f177bb0dd274d5a6632ca3a6799279952dc9f5f80424c8d26c8f21cd930443ba18d34f44869107bfce1cef29e39382907982ea0ab3f4ec721e8ebac8702c554478cde7802bbb4a9afbdc29f30a3e346e70790e38ed9bee919bb64e3c48662046302c97ca033d49f338bca70ec0416460046fb74d089ee5e32c47fb627c78e5c00056228cbabf3543af48470c8b42629c7c5c755911e18a0d859fea6c57b19c3f17c4fde7857082acd1f121fe758898de75e9f1235430e487922f5402724aa97f6686debd98592d1a42446954c091b2b50159d2cbfd02848ca47c1416b447d746caadf3591196ce7e60aee3f509234e0db7dc77052046ffd1b870c74bfd108eb70d7fb5fb20c0dac53765b01114e801a7d1b21c2d7c1dd9d58889bb79cb9561d1f90bcb4dcac01c62a2388274a89dfdd51e2d537896938abf669ec52d0d29fd26f4292fb5fbccb1314d6ccb26f431a605e6e5196faefe30b968609fd39e0c82219d3e005b6772e5231028e871316774a5b51c5c67819e624fcd4fa53c87d923f3b52ffe6e4edf5882965eedf746d7e8039bde20311cc4616822a84eab6af1fae58b7d41213e5a8aad02ffb0f09fe22c055ee9b8b58444543a8ab3351443e974d512f74",
        //"7820820c44013ca8314fb5bd49927d84885e6d53d12df77b307fd4f10a500c1"
        // integretykey
        this.Base64.decode(iv64) + this.Base64.decode(encrypted64),
        integretykey
      );

      //    const mac64 = this.Base64.encode(
      //     String.fromCharCode.apply(null, this.hexToBytes(mac))
      //   );

      var mac64 = this.Base64.encode(
        new Uint8Array(this.hexToBytes(mac)).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      let outputString = `${salt64}:${iv64}:${mac64}:${encrypted64}`;

      // this.setState({
      //   resultString:
      //     "mac64 " +
      //     mac64 +
      //     "\r\nmac " +
      //     mac +
      //     "\r\nhextobytesmac " +
      //     this.hexToBytes(mac) +
      //     "\r\noutputString " +
      //     outputString
      // });

      const filePath = `${RNFS.LibraryDirectoryPath}/FarmsData.json.enc`;
      RNFS.writeFile(filePath, outputString).then(
        // get handle on file path.
        Mailer.mail(
          {
            subject: "Farm Export",
            recipients: [SettingsStore.appSettings.email],

            body: `You have been sent a Crap App farm export. To import into the app click the attachment below and select "copy to Farm Crap App Pro"
            This will open the Crapp App Pro application, in the app navigate to the "Export" screen and enter the password and click import
            `,
            isHTML: false,
            attachment: {
              path: filePath, // The absolute path of the file from which to read data.
              type: "text", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
              name: "FarmsData.json.enc"
            }
          },
          (error, event) => {
            // this.setState({ resultString: event });
            // handle error
          }
        )
      );
    });
  }
  // Convert a hex string to a byte array
  private hexToBytes(hex: string): Array<number> {
    var bytes = new Array<number>();
    for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substring(c, 2), 16));
    return bytes;
  }

  // Convert a byte array to a hex string
  private bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
      var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xf).toString(16));
    }
    return hex.join("");
  }
  private async importJson() {
    const { FarmStore } = this.props;
    // get the encrypted file somehow
    // take the password from the page and decrypt the file
    // merge each thing with our existing database items.
    // display what has been imported (or what will be imported maybe?)

    // const importedFarm: CrapAppExport = data;

    // https://github.com/itinance/react-native-fs
    // RNFS.readdir(RNFS.LibraryDirectoryPath).then(f=> this.setState({resultString:f.join()}));
    // Database location!

    // RNFS.readdir(RNFS.MainBundlePath).then(f=> this.setState({resultString:f.join()}));
    // fonts

    //   RNFS.readdir(RNFS.CachesDirectoryPath+"/am.fo.farm-crap-app-pro").then(f =>
    //    this.setState({ resultString: f.join() })
    // );
    // caches...

    let dataString: string = await RNFS.readFile(
      RNFS.DocumentDirectoryPath + "/Inbox/FarmsData.json.enc"
    );
    let done = await RNFS.unlink(
      RNFS.DocumentDirectoryPath + "/Inbox/FarmsData.json.enc"
    );
    this.setState({ enableImport: false });
    let datajspn: string = await this.decrypt(dataString, "");
    let data: CrapAppExport = JSON.parse(datajspn);

    // Files are here!
    // read file, import data, delete file...
    // detect if we have a file?? on each page?? if yes move to export/import screen?

    let farmExists: Array<Farm>;

    farmExists = await database.getFarms();

    let message = `Data for farm ${data.farm.name} will be imported.
    It contains ${data.farm.fields.length} fields.`;

    if (farmExists.some(f => f.key === data.farm.unique_id)) {
      message = `Data for farm ${data.farm.name} will be overwritten.
      It contains ${data.farm.fields.length} fields.`;
    }

    Alert.alert("Import this farm?", message, [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: async () => {
          let results = await database.importFarm(data);
          //    this.setState({ resultString: results.join() });
          //   FarmStore.getFarms();
          //  this.props.FarmStore.saveFarm();

          //    this.props.FieldStore.farm = FarmStore.farm;
          this.props.FarmStore.refresh = 1;
          this.props.navigation.navigate("Home");
        }
      }
    ]);
  }

  clearFolder() {
    let path = RNFS.DocumentDirectoryPath + "/Inbox";
    RNFS.readDir(path).then(files =>
      files.forEach(file => {
        RNFS.unlink(file.path);
      })
    );
  }

  private bindResultsList(list: Array<string>) {
    // display import results
  }

  private handleEmail = () => {
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;

    this.writeCsvFile().then(arr => {
      const filePath = `${RNFS.LibraryDirectoryPath}/FarmData.csv`;
      RNFS.writeFile(filePath, arr.join("\n"), "utf8").then(
        // get handle on file path.
        Mailer.mail(
          {
            subject: "Farm Data",
            recipients: [SettingsStore.appSettings.email],

            body: "Here is your farm information.",
            isHTML: false,
            attachment: {
              path: filePath, // The absolute path of the file from which to read data.
              type: "csv", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
              name: "FarmData.csv"
            }
          },
          (error, event) => {
            // handle error
          }
        )
      );
    });
    // make farm detials csv
    // write to filesystem
  };

  private writeCsvFile(): Promise<Array<Array<string>>> {
    const { t, i18n } = this.props;
    const csv: Array<Array<string>> = [];
    // Add headings
    csv.push([
      '"Farm name"',
      '"Field name"',
      '"Manure type"',
      '"Date"',
      '"Crop avail N"',
      '"Crop avail P"',
      '"Crop avail K"',
      '"Crop avail S"',
      '"Crop avail Mg"',
      '"Crop req N"',
      '"Crop req P"',
      '"Crop req K"',
      '"Crop req S"',
      '"Crop req Mg"',
      '"SNS"',
      '"Soil"',
      '"Field size"',
      '"Rate"',
      '"Manure quality"',
      '"Manure application"',
      '"Season"',
      '"Crop"'
    ]);
    return database.getCSVData().then(csvData => {
      // Read thru each row and each element and translate each one.
      // then go back to the last element of each row and sort out the crop array into human readable things.

      for (let row = 0; row < csvData.length; row++) {
        for (let item = 0; item < csvData[row].length; item++) {
          csvData[row][item] = t(csvData[row][item]);
        }
        csvData[row][csvData[row].length - 1] = this.makeCropsNice(
          csvData[row][csvData[row].length - 1]
        );
      }

      csv.push(...csvData);
      return csv;
    });
  }

  private makeCropsNice(cropString: string): string {
    const { t, i18n } = this.props;
    let cropPart: string = "";
    const fullList: Array<string> = [];

    const crop = JSON.parse(cropString);
    crop.forEach(f => {
      cropPart = `${t(f[0])}: ${t(f[1])}`;

      fullList.push(cropPart);
    });
    return fullList.join(" ");
  }
  private async requestFileWritePermission() {
    if (Platform.OS !== "ios") {
      try {
        let hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Write storage permission",
              message: "We need to write the csv file before sending it.",
              buttonNegative: "cancel",
              buttonPositive: "ok"
            }
          );
          hasPermission = granted !== PermissionsAndroid.RESULTS.GRANTED;
        }
        if (!hasPermission) {
          // handleError(i18n.t('error_accessing_storage'));
          return;
        }
      } catch (error) {
        //  console.warn(error);
      }
    }
  }
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  Base64 = {
    encode: (input: string = "") => {
      let str = input;
      let output = "";

      for (
        let block = 0, charCode, i = 0, map = this.chars;
        str.charAt(i | 0) || ((map = "="), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
      ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
          );
        }

        block = (block << 8) | charCode;
      }

      return output;
    },

    decode: (input: string = "") => {
      let str = input.replace(/=+$/, "");
      let output = "";

      if (str.length % 4 == 1) {
        throw new Error(
          "'atob' failed: The string to be decoded is not correctly encoded."
        );
      }
      for (
        let bc = 0, bs = 0, buffer, i = 0;
        (buffer = str.charAt(i++));
        ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
          : 0
      ) {
        buffer = this.chars.indexOf(buffer);
      }

      return output;
    }
  };
}
