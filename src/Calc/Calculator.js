import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Picker,
  Slider
} from "react-native";
import styles from "../styles/style";
import data from "../../data/manure.json";
import dropDownData from "./dropDownData.json";
import DropDown from "./DropDown.js";

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soilType: null,
      manureSelected: null,
      applicationSelected: null,
      soilSelected: null,
      cropSelected: null,
      seasonSelected: null,
      qualitySelected: null,
      applicationTypes: {},
      qualityTypes: {}
    };
  }

  componentDidMount() {
    this.SelectManure(this.manureSelected || "fym");
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
        applicationTypes: dropDownData.cattle.dropDowns.application,
        qualityTypes: dropDownData.cattle.dropDowns.quality
      });
    } else if (itemValue === "fym") {
      this.setState({
        applicationTypes: dropDownData.fym.dropDowns.application,
        qualityTypes: dropDownData.fym.dropDowns.quality
      });
    } else if (itemValue === "pig") {
      this.setState({
        applicationTypes: dropDownData.pig.dropDowns.application,
        qualityTypes: dropDownData.pig.dropDowns.quality
      });
    } else if (itemValue === "poultry") {
      this.setState({
        applicationTypes: dropDownData.poultry.dropDowns.application,
        qualityTypes: dropDownData.poultry.dropDowns.quality
      });
    } else if (itemValue === "compost") {
      this.setState({
        applicationTypes: dropDownData.compost.dropDowns.application,
        qualityTypes: dropDownData.compost.dropDowns.quality
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

    var cropType = {
      "winter-wheat-incorporated-feed":
        "Winter wheat, straw incorporated, feed",
      "winter-wheat-incorporated-mill":
        "Winter wheat, straw incorporated, mill",
      "winter-wheat-removed-feed": "Winter wheat, straw removed, feed",
      "winter-wheat-removed-mill": "Winter wheat, straw removed, mill",
      "spring-barley-incorporated-feed":
        "Spring barley, straw incorporated, feed",
      "spring-barley-incorporated-malt":
        "Spring barley, straw incorporated, malt",
      "spring-barley-removed-feed": "Spring barley, straw removed, feed",
      "spring-barley-removed-malt": "Spring barley, straw removed, malt",
      "grass-cut": "Grass cut",
      "grass-grazed": "Grass grazed"
    };
    var soilType = {
      sandyshallow: "Sandy/Shallow",
      peat: "Peat",
      organic: "Organic (10-20% organic matter)",
      mediumshallow: "Medium/Shallow",
      medium: "Medium",
      deepclay: "Deep clay",
      deepsilt: "Deep silt"
    };
    var season = {
      autumn: "Autumn",
      winter: "Winter",
      spring: "Spring",
      summer: "Summer"
    };

    //  var manureApplicationTypes = {};
    return (
      <View style={styles.container}>
        <StatusBar />
        <Text syle={styles.text}>Calculator for crap calculations.</Text>

        <Text>Manure Type</Text>
        <DropDown
          selectedValue={this.state.manureSelected}
          onChange={item => this.SelectManure(item)}
          values={manureTypes}
        />

        <Text>Application Type</Text>
        <DropDown
          selectedValue={this.state.applicationSelected}
          onChange={item => this.setState({ applicationSelected: item })}
          values={this.state.applicationTypes}
        />

        <Text>Soil Type</Text>
        <DropDown
          selectedValue={this.state.soilSelected}
          onChange={item => this.setState({ soilSelected: item })}
          values={soilType}
        />
        <Text>Crop Type</Text>
        <DropDown
          selectedValue={this.state.cropSelected}
          onChange={item => this.setState({ cropSelected: item })}
          values={cropType}
        />
        <Text>Season</Text>
        <DropDown
          selectedValue={this.state.seasonSelected}
          onChange={item => this.setState({ seasonSelected: item })}
          values={season}
        />
        <Text>Quality</Text>
        <DropDown
          selectedValue={this.state.qualitySelected}
          onChange={item => this.setState({ qualitySelected: item })}
          values={this.state.qualityTypes}
        />
        <View style={styles.container}>
          <Slider
            value={this.state.value}
            onValueChange={value => this.setState({ value })}
            maximumValue={299}
            thumbTintColor="rgb(252, 228, 149)"
            minimumTrackTintColor="#FF0000"
            maximumTrackTintColor="#206F98"
          />
          <Text>Value: {this.state.value}</Text>
        </View>
        <Text>a{this.state.manureSelected}</Text>

        <Text>b{this.state.applicationSelected}</Text>

        <Text>c{JSON.stringify(this.state.applicationTypes)}</Text>
      </View>
    );
  }
}
