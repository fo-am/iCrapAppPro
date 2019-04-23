import { Picker } from "native-base";
import React, { Component } from "react";
import { View } from "react-native";

interface Props {
  selectedValue: number | string;
  onChange: any;
  values: any;
  style?: any;
}

interface State {}

export default class DropDown extends Component<Props, State> {
  public render() {
    let enabled = false;

    if (Object.keys(this.props.values || []).length !== 0) {
      enabled = true;
    }

    return (
      <View style={this.props.style}>
        <Picker
          enabled={enabled}
          selectedValue={this.props.selectedValue}
          style={{ height: 50, width: "100%" }}
          onValueChange={this.props.onChange}
        >
          {Object.keys(this.props.values || []).map(key => {
            return (
              <Picker.Item
                label={this.props.values[key]}
                value={key}
                key={key}
              />
            );
          })}
        </Picker>
      </View>
    );
  }
}
