import React, { Component } from "react";
import { Picker, View } from "react-native";

interface Props {
  selectedValue: number | string;
  onChange: any;
  values: any;
}

interface State {}

export default class DropDown extends Component<Props, State> {
  public render() {
    return (
      <Picker
        selectedValue={this.props.selectedValue}
        style={{ height: 50, width: 200 }}
        onValueChange={this.props.onChange}
      >
        {Object.keys(this.props.values).map(key => {
          return (
            <Picker.Item label={this.props.values[key]} value={key} key={key} />
          );
        })}
      </Picker>
    );
  }
}
