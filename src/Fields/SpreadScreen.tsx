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

import DatePicker from "react-native-datepicker";
import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";

import Field from "../model/field";

import Styles from "../styles/style";

import Fieldstore from "../store/FieldsStore";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
}

interface State {}

@inject("FieldStore")
@observer
export default class SpreadScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  public componentWillMount() {
    const { navigation, FieldStore } = this.props;
    const item = navigation.getParam("fieldKey", undefined);
    if (item) {
      FieldStore.SetField(item);
    } else {
      FieldStore.reset();
    }
  }

  public render() {
    const { FieldStore } = this.props;
    return (
      <ScrollView style={Styles.container}>
        <StatusBar />

        <Text>{FieldStore.field.name}</Text>
        <Text>Enter new crap spreading event</Text>
        <Text>Manure type</Text>
        <Text>Date</Text>
        <DatePicker
          style={{ width: 200 }}
          date={Fieldstore.newSpreadEvent.date}
          mode="date"
          format="DD-MM-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={date => {
            Fieldstore.newSpreadEvent.date = date;
          }}
        />
        <Text>Quality</Text>
        <Text>Application type</Text>
        <Text>Spread spread</Text>
        <Text>ammount slider</Text>
      </ScrollView>
    );
  }
}
