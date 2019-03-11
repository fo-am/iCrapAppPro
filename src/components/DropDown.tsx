import { Picker } from "native-base";
import React, { Component } from "react";

interface Props {
  selectedValue: number | string;
  onChange: any;
  values: any;
}

interface State {}

export default class DropDown extends Component<Props, State> {
  public render() {
    let enabled = false;

    if (Object.keys(this.props.values || []).length !== 0) {
      enabled = true;
    }

    return (
      <Picker
        enabled={enabled}
        selectedValue={this.props.selectedValue}
        style={{ height: 50, width: "100%" }}
        onValueChange={this.props.onChange}
      >
        {Object.keys(this.props.values || []).map(key => {
          return (
            <Picker.Item label={this.props.values[key]} value={key} key={key} />
          );
        })}
      </Picker>
    );
  }
}
