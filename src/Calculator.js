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
import data from "../data/manure.json";

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manure: "cattle",
      soilType: null,
      manureSelected: null
    };
  }

  componentDidMount() {
    //  this.getSoil();
  }

  getSoil(value) {
    var soil = "";
    //  var arrayLength = data.choices.length;
    // for (var i = 0; i < arrayLength; i++) {
    //  soil += JSON.stringify(data.choices[i].choice) + " ";
    // }

    for (key in data.choices) {
      if (data.choices[key].choice === value) {
        soil = JSON.stringify(data.choices[key].value);
      }
    }

    this.setState({ soilType: soil });
  }
  DoIt = item => this.DoItem(item);

  DoItem(itemValue) {
    this.getSoil(itemValue);
    this.setState({ manureSelected: itemValue });
  }

  render() {
    var manureTypes = {
      cattle: "Cattle Slurry",
      fym: "Farmyard Manure"
    };

    return (
      <View style={Styles.container}>
        <StatusBar />
        <Text syle={Styles.text}>Calculator for crap calculations.</Text>

        <Picker
          selectedValue={this.state.manureSelected}
          style={{ height: 50, width: 200 }}
          onValueChange={this.DoIt}
        >
          {Object.keys(manureTypes).map(key => {
            return (
              <Picker.Item label={manureTypes[key]} value={key} key={key} />
            );
          })}
        </Picker>

        <Text>{this.state.manureSelected}</Text>

        <Text>{this.state.soilType}</Text>
      </View>
    );
  }
}
