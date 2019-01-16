import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Picker,
  ScrollView,
  Slider,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import Images from "../assets/imageData";
import styles from "../styles/style";

import DropDown from "../components/DropDown";

interface Props {
  SettingsStore: SettingsStore;
}

interface State {}

@inject("SettingsStore")
@observer
export default class SettingScreen extends Component<Props, State> {
  public Units = {
    metric: "Metric",
    imperial: "Imperial"
  };
  public RainfallTypes = {
    "rain-high": "High (> 700mm)",
    "rain-medium": "Medium (600-700mm)",
    "rain-low": "Low (< 600mm)"
  };

  public render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <StatusBar />
          <Text>Choose Unit type</Text>
          <DropDown
            selectedValue={this.props.SettingsStore.unit}
            onChange={item => this.props.SettingsStore.SelectUnit(item)}
            values={this.Units}
          />
          <Text>Set Farm Rainfall</Text>
          <DropDown
            selectedValue={this.props.SettingsStore.rainfall}
            onChange={item => this.props.SettingsStore.SelectRainfall(item)}
            values={this.RainfallTypes}
          />
          <Text>
            How much do you pay for your fertiliser? This is used to calculate
            your cost savings.
          </Text>
          <Text>N(£ per Kg)</Text>
          <TextInput>{}</TextInput>
          <Text>
            P<Text style={{ fontSize: 11, lineHeight: 37 }}>2</Text>O
            <Text style={{ fontSize: 11, lineHeight: 37 }}>5</Text>(£ per Kg)
          </Text>
          <TextInput>{}</TextInput>
          <Text>
            K<Text style={{ fontSize: 11, lineHeight: 37 }}>2</Text>
            O(£ per Kg)
          </Text>
          <TextInput>{}</TextInput>
        </View>
      </ScrollView>
    );
  }
}
