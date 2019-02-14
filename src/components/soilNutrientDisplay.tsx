import { H1 } from "native-base";
import React, { Component } from "react";
import { Maths } from "../assets/Math";
interface Props {
  value: string;
}

interface State {}

export default class SoilNutrientDisplay extends Component<Props, State> {
  public soilNutrientCodeToTextMetric = {
    "0": "<60",
    "1": "61-80",
    "2": "81-100",
    "3": "101-120",
    "4": "121-160",
    "5": "161-240",
    "6": ">240",
    "grassland-high-sns": "Grassland high SNS",
    "grassland-med-sns": "Grassland medium SNS",
    "grassland-low-sns": "Grassland low SNS"
  };
  public soilNutrientCodeToTextImperial = {
    "0": "<48",
    "1": "49-64",
    "2": "65-80",
    "3": "81-96",
    "4": "97-128",
    "5": "129-192",
    "6": ">193",
    "grassland-high-sns": "Grassland high SNS",
    "grassland-med-sns": "Grassland medium SNS",
    "grassland-low-sns": "Grassland low SNS"
  };
  public render() {
    return <H1>{this.soilNutrientCodeToTextMetric[this.props.value]}</H1>;
  }

  private FormattedValue(value: number): string {
    return String(Maths.Round(value, 2));
  }
}
