import React, { Component } from "react";
import { Text, View } from "react-native";
import { Maths } from "../assets/Math";
interface Props {
  value: number;
}

interface State {}

export default class CashDisplay extends Component<Props, State> {
  public render() {
    return <Text>£{this.FormattedValue(this.props.value)}</Text>;
  }
  private FormattedValue(value: number): string {
    if (isNaN(value)) {
      value = 0;
    }
    return String(Maths.Round(value, 2));
  }
}
