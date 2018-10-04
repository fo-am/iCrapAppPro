import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Picker
} from "react-native";
import Styles from "./styles/style";
import data from "../data/soil-nitrogen-supply.json";

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "js",
      soilType: null
    };
  }

  componentDidMount() {
    this.getSoil();
  }

  getSoil() {
    var soil;
    var arrayLength = data.choices.length;
    for (var i = 0; i < arrayLength; i++) {
      soil += JSON.stringify(data.choices[i].choice);

      //Do something
    }
    this.setState({ soilType: soil });
  }
  render() {
    return (
      <View style={Styles.container}>
        <StatusBar />
        <Text syle={Styles.text}>Top stuff that is very good </Text>

        <Picker
          selectedValue={this.state.language}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ language: itemValue })}
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
        <Text>{this.state.soilType}</Text>
      </View>
    );
  }
}
