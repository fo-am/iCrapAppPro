import { Text } from "native-base";
import React, { Component } from "react";
import { Maths } from "../assets/Math";
interface Props {
  value: number;
}

interface State {}

export default class CashDisplay extends Component<Props, State> {
  public render() {
    return (
      <Text style={styles.text}>£{this.FormattedValue(this.props.value)}</Text>
    );
  }
  private FormattedValue(value: number): string {
    if (isNaN(value)) {
      value = 0;
    }
    return String(Maths.Round(value, 2));
  }
}
