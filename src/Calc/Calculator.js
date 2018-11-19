import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Picker
} from "react-native";
import Styles from "../styles/style";
import data from "../../data/manure.json";
import dropdowns from "./dropdowns.json";
import DropDown from "./DropDown.js";

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soilType: null,
      manureSelected: null,
      applicationSelected: null,
      applicationTypes: {}
    };
  }

  componentDidMount() {
    //  this.getSoil();
    this.SelectManure(this.manureSelected || "cattle");
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
    if (itemValue === "cattle") {
      this.setState({
        applicationTypes: dropdowns.cattle.dropDowns.application
      });
    } else {
      this.setState({ applicationTypes: {} });
      this.setState({ SelectApplicationType: null });
    }
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
    //  var manureApplicationTypes = {};
    return (
      <View style={Styles.container}>
        <StatusBar />
        <Text syle={Styles.text}>Calculator for crap calculations.</Text>

        <Text>Manure Type</Text>
        <DropDown
          selectedValue={this.state.manureSelected}
          onChange={item => this.SelectManure(item)}
          values={manureTypes}
        />

        <Text>Application Type</Text>
        <DropDown
          selectedValue={this.state.applicationSelected}
          onChange={item => this.SelectApplicationType(item)}
          values={this.state.applicationTypes}
        />


        <Text>Soil Type</Text>
        <Text>Crop Type</Text>
        <Text>Season</Text>
        <Text>Quality</Text>

        <Text>a{this.state.manureSelected}</Text>

        <Text>b{this.state.applicationSelected}</Text>

        <Text>c{JSON.stringify(this.state.applicationTypes)}</Text>
      </View>
    );
  }
}
