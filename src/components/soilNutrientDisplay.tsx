import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { Text } from "react-native";
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
    0: "<60",
    1: "61-80",
    2: "81-100",
    3: "101-120",
    4: "121-160",
    5: "161-240",
    6: ">240",
    "grassland-high-sns": "Grassland high SNS",
    "grassland-med-sns": "Grassland medium SNS",
    "grassland-low-sns": "Grassland low SNS"
  };
  public soilNutrientCodeToTextImperial = {
    0: "<48",
    1: "49-64",
    2: "65-80",
    3: "81-96",
    4: "97-128",
    5: "129-192",
    6: ">193",
    "grassland-high-sns": "Grassland high SNS",
    "grassland-med-sns": "Grassland medium SNS",
    "grassland-low-sns": "Grassland low SNS"
  };
  public render() {
    const { SettingsStore } = this.props;
    if (SettingsStore.appSettings.unit !== "metric") {
      return (
        <Text style={styles.H2}>
          {this.soilNutrientCodeToTextImperial[this.props.value]}
        </Text>
      );
    }
    return (
      <Text style={styles.H2}>
        {this.soilNutrientCodeToTextMetric[this.props.value]}
      </Text>
    );
  }

  private FormattedValue(value: number): string {
    return String(Maths.Round(value, 2));
  }
}
