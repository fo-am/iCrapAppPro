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

import { NavigationScreenProp } from "react-navigation";

import dropDownData from "../assets/dropDownData.json";

import DisplayPoundsPerArea from "../components/displayPoundsPerArea";
import DropDown from "../components/DropDown";

import SphericalUtil from "../geoUtils";
import Field from "../model/field";

import styles from "../styles/style";

import Strings from "../assets/strings";

import { database } from "../database/Database.js";

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
            <Button>
              <Text>Export to {SettingsStore.appSettings.email}</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
