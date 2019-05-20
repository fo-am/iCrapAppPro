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
import data from "./farm.json";

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
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
    this.state = {
      password: "crapapp",
      resultString: data.farm["app-version"]
    };

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
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.importJson()}
              title={"Import data!"}
            />

            <Text style={styles.text}>{this.state.resultString}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  private async importJson() {
    // get the encrypted file somehow
    // take the password from the page and decrypt the file
    // merge each thing with our existing database items.
    // display what has been imported (or what will be imported maybe?)

    const importedFarm: CrapAppExport = data;

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
        onPress: () =>
          database
            .importFarm(importedFarm)
            .then(list => this.bindResultsList(list))
      }
    ]);
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
