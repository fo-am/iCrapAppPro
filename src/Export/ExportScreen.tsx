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
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View
} from "react-native";

import Mailer from "react-native-mail";
import { NavigationScreenProp } from "react-navigation";

const id = 0;

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
    // make farm detials csv
    // get handle on file path.
    Mailer.mail(
      {
        subject: "Farm Data",
        recipients: [SettingsStore.appSettings.email],

        body: "Here is your farm information.",
        isHTML: false,
        attachment: {
          path: "", // The absolute path of the file from which to read data.
          type: "", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
          name: "" // Optional: Custom filename for attachment
        }
      },
      (error, event) => {
        // handle error
      }
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
              <Text>Export to {SettingsStore.appSettings.email}</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
