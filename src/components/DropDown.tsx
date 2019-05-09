import {
  Body,
  Button,
  Header,
  Icon,
  Left,
  Picker,
  Right,
  Title
} from "native-base";
import React, { Component } from "react";
import { View } from "react-native";

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
            <Header>
              <Left />
              <Body style={{ flex: 3 }}>
                <Title style={styles.text}>Make a selection</Title>
              </Body>
              <Right />
            </Header>
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
