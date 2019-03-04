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
}

@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class ExportScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
  }

  public componentWillMount() {
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
  }
  public handleEmail = () => {
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
    this.requestCameraPermission();
    // make farm detials csv
    // write to filesystem
    const filePath = RNFS.ExternalStorageDirectoryPath + "/test.txt";
    RNFS.writeFile(filePath, "Lorem ipsum dolor sit amet", "utf8")
      .then(success => {
        console.log("FILE WRITTEN!");
      })
      .catch(err => {
        console.log(err.message);
      })
      .then(
        // get handle on file path.
        Mailer.mail(
          {
            subject: "Farm Data",
            recipients: [SettingsStore.appSettings.email],

            body: "Here is your farm information.",
            isHTML: false,
            attachment: {
              path: filePath, // The absolute path of the file from which to read data.
              type: "", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
              name: "" // Optional: Custom filename for attachment
            }
          },
          (error, event) => {
            // handle error
          }
        )
      );
  };

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
              <Text>Send Farm data to {SettingsStore.appSettings.email}</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
  private async requestCameraPermission() {
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
