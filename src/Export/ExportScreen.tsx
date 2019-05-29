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
import {
  Coord,
  CrapAppExport,
  Event,
  Farm as ExportFarm,
  Field
} from "./exportModel";
// import data from "./farm.json";

import { generateSecureRandom } from "react-native-securerandom";
const Aes = NativeModules.Aes;

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
  }

  public render() {
    const {
      FieldStore,
      CalculatorStore,
      SettingsStore,
      FarmStore
    } = this.props;
    this.ImportEnable();
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
              title={"Import data!"}
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
    const stuff = text.split(":");

    //   const saltbytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //  const salt = String.fromCharCode.apply(null, saltbytes);
    const salt = stuff[0];
    const iv = stuff[1];
    const payload = stuff[3];

    const longkey = await Aes.pbkdf2(this.state.password, salt, 10000, 384);

    const confidentialityKey = longkey.substring(0, 32);
    const integretykey = longkey.substring(32, 96);

    try {
      return await Aes.decrypt(payload, confidentialityKey, iv).then(d => {
        return d;
      });
    } catch (exc) {
      if (
        exc instanceof Error &&
        (exc.message.includes("BAD_DECRYPT") ||
          exc.message.includes("Decrypt failed"))
      ) {
        console.log("bad decrypt");
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

      const longkeyBytes: string = await Aes.pbkdf2(
        password,
        salt64,
        10000,
        384
      );
      // conf key is 16 bytes in Java... 32 here?
      const confidentialityKey = longkeyBytes.substring(0, 32);
      const integretykey = longkeyBytes.substring(32, 96);

      const encrypted64 = await Aes.encrypt(
        JSON.stringify(farm),
        confidentialityKey,
        iv64
      );

      const mac = await Aes.hmac256(iv64 + encrypted64, integretykey);
      const mac64 = this.Base64.encode(mac);

      let outputString = `${salt64}:${iv64}:${mac64}:${encrypted64}`;

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
  private async importJson() {
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
        onPress: () => {
          database.importFarm(data).then(list => {
            this.bindResultsList(list);

            this.props.FarmStore.getFarms();
          });
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

    atob: (input: string = "") => {
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
