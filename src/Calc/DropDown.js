import React, { Component } from "react";
import { View, Picker } from "react-native";

export default class DropDown extends Component {
  render() {
    return (
      <View>
        <Picker
          selectedValue={this.props.selectedValue}
          style={{ height: 50, width: 200 }}
          onValueChange={this.props.onChange}
        >
          {Object.keys(this.props.values).map(key => {
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
