import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { translate } from "react-i18next";
import {
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
import { generateSecureRandom } from "react-native-securerandom";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import { database } from "../database/Database";
import styles from "../styles/style";

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
  textEncode: string;
}

@translate(["common"], { wait: true })
@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class ExportScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      resultString: "",
      password: "crapapp",
      textEncode:
        "sQoaW1PC8w5NXfwhxLN4GTWvYEavgbW+Fc4q8m2sxdSdfv9GstLDd2ig5DuDNEW2MJXi45mgAJlMpkaEEFPt5oGUpsog8JqTIbWJX0kiqxubPUbtWV7Hco+J7OoxHUiRl6MNh+fFTh9M2+kr1a0NoLTQEU4vdGfgeHyhBsZ0Wkg=:W0kL6nz7J7HOVhWoZ1g1QQ==:bh6WDTHqqS/nPW3fAaLA0dbel+I71sdfxZmnrookQeM=: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"
    };

    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
    this.requestFileWritePermission();
  }

  public componentWillMount() {
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
  }

  public render() {
    const {
      FieldStore,
      CalculatorStore,
      SettingsStore,
      FarmStore
    } = this.props;

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

            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.exportJson()}
              title={" Export Farm data to " + SettingsStore.appSettings.email}
            />
            <Input
              selectTextOnFocus={true}
              label="Enter A Password"
              labelStyle={styles.text}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              onChangeText={text => this.setState({ password: text })}
              placeholder="Hunter1"
            >
              {this.state.password}
            </Input>

            <Input
              selectTextOnFocus={true}
              label="Text to encode"
              labelStyle={styles.text}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              onChangeText={text => this.setState({ textEncode: text })}
            >
              {this.state.textEncode}
            </Input>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.encryptText()}
              title={"encrypt it!"}
            />
            <Text style={styles.text}>{this.state.resultString}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  private encryptText(): void {
    this.decrypt(this.state.textEncode, this.state.password).then(f =>
      this.setState({ resultString: f })
    );
  }
  private async encrypt(text: string, password: string): Promise<string> {
    const key = (await Aes.pbkdf2(password, "salt", 5000, 512)).substring(
      0,
      32
    );
    const iv = (await generateSecureRandom(32))
      .toString("hex")
      .substring(0, 32);
    const result = await Aes.encrypt(text, key, iv);
    const sum = await Aes.sha512(result);
    return sum + iv + result;
  }

  private async decrypt(text: string, password: string): Promise<string> {
    const stuff = text.split(":");

    const salt = stuff[0];
    const iv = stuff[1];
    const payload = stuff[3];

    const longkey = await Aes.pbkdf2(password, salt, 10000, 384);

    try {
      return await Aes.decrypt(payload, longkey, iv).then(d => {
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
  private exportJson() {
    // get data from database and put it into the json format
    // encrypt the json
    // email the json
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;

    database.getAllData().then(farms => {
      const filePath = `${RNFS.LibraryDirectoryPath}/FarmsData.json.enc`;
      RNFS.writeFile(filePath, JSON.stringify(farms)).then(
        // get handle on file path.
        Mailer.mail(
          {
            subject: "Farm Export",
            recipients: [SettingsStore.appSettings.email],

            body: "Here is your farm export.",
            isHTML: false,
            attachment: {
              path: filePath, // The absolute path of the file from which to read data.
              type: "text", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
              name: "FarmsData.json.enc"
            }
          },
          (error, event) => {
            this.setState({ resultString: event });
            // handle error
          }
        )
      );
    });
  }

  private importJson() {
    // get the encrypted file somehow
    // take the password from the page and decrypt the file
    // merge each thing with our existing database items.
    // display what has been imported (or what will be imported maybe?)
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
            this.setState({ resultString: event });
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
}
