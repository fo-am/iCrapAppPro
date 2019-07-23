import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Text, View } from "react-native";
import { Maths } from "../assets/Math";
import styles from "../styles/style";

interface Props {
  value: string;
  SettingsStore?: SettingsStore;
}

interface State {}

@inject("SettingsStore")
@observer
export default class SoilNutrientDisplay extends Component<Props, State> {
  public soilNutrientCodeToTextMetric = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    "grassland-high-sns": "Grassland high SNS",
    "grassland-med-sns": "Grassland medium SNS",
    "grassland-low-sns": "Grassland low SNS",
    100: "Grassland high SNS",
    101: "Grassland medium SNS",
    102: "Grassland low SNS"
  };
  public soilNutrientCodeToTextImperial = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    "grassland-high-sns": "Grassland high SNS",
    "grassland-med-sns": "Grassland medium SNS",
    "grassland-low-sns": "Grassland low SNS",
    100: "Grassland high SNS",
    101: "Grassland medium SNS",
    102: "Grassland low SNS"
  };
  public render() {
    const { SettingsStore } = this.props;
    if (SettingsStore.appSettings.unit !== "metric") {
      return (
        <View style={styles.outline}>
          <Text style={[styles.H2, { textAlign: "center" }]}>
            {this.soilNutrientCodeToTextImperial[this.props.value]}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.outline}>
        <Text style={[styles.H2, { textAlign: "center" }]}>
          {this.soilNutrientCodeToTextMetric[this.props.value]}
        </Text>
      </View>
    );
  }
}
