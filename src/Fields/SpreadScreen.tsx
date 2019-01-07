import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { NavigationScreenProp } from "react-navigation";

import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";

import Field from "../model/field";
import FieldStore from "../store/FieldsStore";
import Styles from "../styles/style";

interface Props {}

interface State {}

@inject("FieldStore")
@observer
export default class SpreadScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <ScrollView style={Styles.container}>
        <StatusBar />

        <Text>Spread spread</Text>
      </ScrollView>
    );
  }
}
