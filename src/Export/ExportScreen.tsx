import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Col,
  Container,
  Content,
  Footer,
  Form,
  Grid,
  H1,
  H2,
  H3,
  Header,
  Input,
  Left,
  Right,
  Row,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View
} from "react-native";

import RNFS from "react-native-fs";
import Mailer from "react-native-mail";
import { NavigationScreenProp } from "react-navigation";
import { database } from "../database/Database";
import Farm from "../model/Farm";

import { toJS } from "mobx";

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
  errorsString: string;
}

@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class ExportScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { errorsString: "" };

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
      <Container>
        <Content>
          <Form>
            <Button onPress={this.handleEmail}>
              <Text>Send csv data to {SettingsStore.appSettings.email}</Text>
            </Button>
          </Form>
          <Form>
            <Button onPress={() => this.exportJson()}>
              <Text>Export Farm data to {SettingsStore.appSettings.email}</Text>
            </Button>
            <Text>{this.state.errorsString}</Text>
          </Form>
        </Content>
      </Container>
    );
  }
  private exportJson() {
    // get data from database and put it into the json format
    // encrypt the json
    // email the json
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;

    database.getAllData().then(farms => {
      const filePath = `${RNFS.DocumentDirectoryPath}/FarmData.json`;
      RNFS.writeFile(filePath, JSON.stringify(farms)).then(
        // get handle on file path.
        Mailer.mail(
          {
            subject: "Farm Export",
            recipients: [SettingsStore.appSettings.email],

            body: "Here is your farm Export.",
            isHTML: false,
            attachment: {
              path: filePath, // The absolute path of the file from which to read data.
              type: "application/json" // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            }
          },
          (error, event) => {
            this.setState({ errorsString: error + " " + event });
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
      const filePath = `${RNFS.DocumentDirectoryPath}/FarmData.csv`;
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
              type: "text/csv" // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            }
          },
          (error, event) => {
            this.setState({ errorsString: error + " " + event });
            // handle error
          }
        )
      );
    });
    // make farm detials csv
    // write to filesystem
  };

  private writeCsvFile(): Promise<Array<Array<string>>> {
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
      '"Crop req N"',
      '"Crop req P"',
      '"Crop req K"',
      '"SNS"',
      '"Soil"',
      '"Field size"',
      '"Rate"',
      '"Manure quality"',
      '"Manure application"',
      '"Season"',
      '"Crop"'
    ]);
    return database.getCSVData().then(res => {
      csv.push(...res);
      return csv;
    });
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
