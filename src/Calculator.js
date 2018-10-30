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
      soilType: null,
      manureSelected: null,
      applicationSelected: null,
      manureApplicationTypes: {}
    };
  }

  componentDidMount() {
    //  this.getSoil();
  }

  getSoil(value) {
    var soil = "";
    for (key in data.choices) {
      if (data.choices[key].choice === value) {
        soil = JSON.stringify(data.choices[key].value);
      }
    }

    this.setState({ soilType: soil });
  }

  SelectManure(itemValue) {
    this.setState({ manureSelected: itemValue });
    this.setState({
      manureApplicationTypes: {
        "splash-surface": "Splash Surface",
        "splash-incorporated": "Splash Incorporated",
        "shoe-bar-spreader": "Shoe Bar Spreader",
        "shallow-injected": "Shallow Injected"
      }
    });
  }
  SelectApplicationType(itemValue) {
    this.setState({ applicationSelected: itemValue });
  }
  render() {
    var manureTypes = {
      cattle: "Cattle Slurry",
      fym: "Farmyard Manure",
      pig: "Pig Slurry",
      poultry: "Poultry Litter",
      compost: "Compost"
    };
    var manureApplicationTypes = {};
    return (
      <View style={Styles.container}>
        <StatusBar />
        <Text syle={Styles.text}>Calculator for crap calculations.</Text>

        <Text>Manure Type</Text>
        <Picker
          selectedValue={this.state.manureSelected}
          style={{ height: 50, width: 200 }}
          onValueChange={item => this.SelectManure(item)}
        >
          {Object.keys(manureTypes).map(key => {
            return (
              <Picker.Item label={manureTypes[key]} value={key} key={key} />
            );
          })}
        </Picker>

        <Text>Application Type</Text>
        <Picker
          selectedValue={this.state.applicationSelected}
          style={{ height: 50, width: 200 }}
          onValueChange={item => this.SelectApplicationType(item)}
        >
          {Object.keys(this.state.manureApplicationTypes).map(key => {
            return (
              <Picker.Item
                label={this.state.manureApplicationTypes[key]}
                value={key}
                key={key}
              />
            );
          })}
        </Picker>
        <Text>Soil Type</Text>
        <Text>Crop Type</Text>
        <Text>Season</Text>
        <Text>Quality</Text>

        <Text>{this.state.manureSelected}</Text>

        <Text>{this.state.soilType}</Text>
      </View>
    );
  }
}
