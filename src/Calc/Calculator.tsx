import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Picker,
  ScrollView,
  Slider,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import ManureStore from "../store/manureStore";
import Manure from "./../model/manure";

import data from "../assets/data/manure.json";
import Images from "../assets/imageData";
import styles from "../styles/style";
import DropDown from "./DropDown";
import dropDownData from "./dropDownData.json";

interface Props {
  ManureStore: ManureStore;
}

interface State {
  soilType: string | undefined;
  manureSelected: string;
  applicationSelected: string | undefined;
  soilSelected: string | undefined;
  cropSelected: string | undefined;
  seasonSelected: string | undefined;
  qualitySelected: string | undefined;
  applicationTypes: Array<string>;
  qualityTypes: Array<string>;
  customQualityTypes: Array<string>;
  sliderValue: number | undefined;
  sliderStartValue: number | undefined;
  sliderMaxValue: number | undefined;
  sliderUnit: string | undefined;
  image: string | undefined;
  Nitrogen: number | undefined;
  Phosphorus: number | undefined;
  Potassium: number | undefined;
  testArray: Array<string>;
  testVal: number | undefined;
}
@inject("ManureStore")
@observer
export default class Calculator extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      soilType: undefined,
      manureSelected: "fym",
      applicationSelected: undefined,
      soilSelected: undefined,
      cropSelected: undefined,
      seasonSelected: undefined,
      qualitySelected: undefined,
      applicationTypes: [],
      qualityTypes: [],
      customQualityTypes: [],
      sliderValue: undefined,
      sliderStartValue: undefined,
      sliderMaxValue: 1,
      sliderUnit: undefined,
      image: undefined,
      Nitrogen: undefined,
      Phosphorus: undefined,
      Potassium: undefined,
      testArray: [],
      testVal: undefined
    };

    this.state.applicationTypes =
      dropDownData[this.state.manureSelected].dropDowns.application;
    this.state.qualityTypes =
      dropDownData[this.state.manureSelected].dropDowns.quality;
    this.state.sliderStartValue =
      dropDownData[this.state.manureSelected].slider.maxValue / 2;
    this.state.sliderValue =
      dropDownData[this.state.manureSelected].slider.maxValue / 2;
    this.state.sliderMaxValue =
      dropDownData[this.state.manureSelected].slider.maxValue;
    this.state.sliderUnit =
      dropDownData[this.state.manureSelected].slider.metricUnit;

    const values = {};

    this.props.ManureStore.manures.forEach(o => {
      values[o.key] = o.name;
    });

    this.state.customQualityTypes = values;
  }

  public componentDidMount() {
    this.SelectManure(this.state.manureSelected);
  }

  public SelectManure(itemValue) {
    this.setState({ manureSelected: itemValue });
    if (itemValue === "custom") {
      this.setState(
        {
          applicationTypes: [],
          qualityTypes: this.state.customQualityTypes,
          sliderStartValue: 50,
          sliderValue: 50,
          sliderMaxValue: 100,
          sliderUnit: "m3/ha"
        },
        () => this.SliderValueChanged(this.state.sliderValue)
      );
    } else {
      this.setState(
        {
          applicationTypes: dropDownData[itemValue].dropDowns.application,
          qualityTypes: dropDownData[itemValue].dropDowns.quality,
          sliderStartValue: dropDownData[itemValue].slider.maxValue / 2,
          sliderValue: dropDownData[itemValue].slider.maxValue / 2,
          sliderMaxValue: dropDownData[itemValue].slider.maxValue,
          sliderUnit: dropDownData[itemValue].slider.metricUnit
        },
        () => this.SliderValueChanged(this.state.sliderValue)
      );
    }
  }

  public SliderValueChanged(value) {
    this.setState({ sliderValue: value });

    const keys = [] as number[];
    for (const k in Images[this.state.manureSelected]) {
      keys.push(Number(k));
    }

    const closestValue = this.closest(value, keys);
    if (this.state.manureSelected == "custom") {
      this.setState({ image: Images.fym["50"] });
    } else {
      this.setState({
        image: Images[this.state.manureSelected][closestValue]
      });
    }
  }

  public closest(num: number, arr: Array<number>) {
    let curr = arr[0];
    let diff = Math.abs(num - curr);

    for (let index = 0; index < arr.length; index++) {
      const newdiff = Math.abs(num - arr[index]);
      if (newdiff < diff) {
        diff = newdiff;
        curr = arr[index];
      }
    }
    return curr;
  }

  public SelectApplicationType(itemValue: string) {
    this.setState({ applicationSelected: itemValue });
  }
  public render() {
    const manureTypes = {
      cattle: "Cattle Slurry",
      fym: "Farmyard Manure",
      pig: "Pig Slurry",
      poultry: "Poultry Litter",
      compost: "Compost",
      custom: "Custom"
    };

    const cropType = {
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
    const soilType = {
      sandyshallow: "Sandy/Shallow",
      peat: "Peat",
      organic: "Organic (10-20% organic matter)",
      mediumshallow: "Medium/Shallow",
      medium: "Medium",
      deepclay: "Deep clay",
      deepsilt: "Deep silt"
    };
    const season = {
      autumn: "Autumn",
      winter: "Winter",
      spring: "Spring",
      summer: "Summer"
    };

    //  var manureApplicationTypes = {};
    return (
      <ScrollView>
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
              step={0.1}
              value={this.state.sliderStartValue}
              onValueChange={val => this.SliderValueChanged(val)}
              maximumValue={this.state.sliderMaxValue}
              thumbTintColor="rgb(252, 228, 149)"
              minimumTrackTintColor="#FF0000"
              maximumTrackTintColor="#206F98"
            />
            <Text>
              Value: {this.state.sliderValue} {this.state.sliderUnit}
            </Text>
          </View>

          <Image source={this.state.image} />
          <Text>Crop available nutrients(Total in manure)</Text>
          <Text>N {this.state.Nitrogen}</Text>
          <Text>P2O5 {this.state.Phosphorus}</Text>
          <Text>K2O {this.state.Potassium}</Text>
          <Text>Fertiliser Savings</Text>

          <Text>c{JSON.stringify(this.state.testArray)}</Text>
        </View>
      </ScrollView>
    );
  }
}
