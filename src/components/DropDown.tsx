import { Picker, Right } from "native-base";
import React, { Component } from "react";
import { View, Text } from "react-native";

import styles from "../styles/style";

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
          renderHeader={backAction => (
            <View>
              <Text style={[styles.H3, { textAlign: "center" }]}>
                Make a selection
              </Text>

              <Right />
            </View>
          )}
          enabled={enabled}
          selectedValue={this.props.selectedValue}
          style={{ height: 50, width: "100%" }}
          onValueChange={this.props.onChange}
          itemTextStyle={styles.text}
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
