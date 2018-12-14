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

import Images from "../assets/imageData";
import styles from "../styles/style";
import DropDown from "./DropDown";
import dropDownData from "./dropDownData.json";

import SliderValues from "../model/sliderValues";
import CalculatorStore from "../store/calculatorStore";
import calculatorStore from "../store/calculatorStore";

interface Props {
  ManureStore: ManureStore;
}

interface State {
  soilType: string | undefined;
  applicationTypes: Array<string>;
  qualityTypes: Array<string>;
  customQualityTypes: Array<string>;

  image: string | undefined;
  Nitrogen: number | undefined;
  Phosphorus: number | undefined;
  Potassium: number | undefined;
  testArray: Array<string>;
  testVal: number | undefined;
}

const slider = new SliderValues();
const calculatorValues = CalculatorStore.calculatorValues;

@inject("ManureStore")
@observer
export default class Calculator extends Component<Props, State> {
  public manureTypes = {
    cattle: "Cattle Slurry",
    fym: "Farmyard Manure",
    pig: "Pig Slurry",
    poultry: "Poultry Litter",
    compost: "Compost",
    custom: "Custom"
  };

  public cropType = {
    "winter-wheat-incorporated-feed": "Winter wheat, straw incorporated, feed",
    "winter-wheat-incorporated-mill": "Winter wheat, straw incorporated, mill",
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
  public soilType = {
    sandyshallow: "Sandy/Shallow",
    peat: "Peat",
    organic: "Organic (10-20% organic matter)",
    mediumshallow: "Medium/Shallow",
    medium: "Medium",
    deepclay: "Deep clay",
    deepsilt: "Deep silt"
  };
  public season = {
    autumn: "Autumn",
    winter: "Winter",
    spring: "Spring",
    summer: "Summer"
  };

  constructor(props) {
    super(props);
    calculatorValues.manureSelected = "fym";
    this.state = {
      soilType: undefined,
      applicationTypes: [],
      qualityTypes: [],
      customQualityTypes: [],
      image: undefined,
      Nitrogen: undefined,
      Phosphorus: undefined,
      Potassium: undefined,
      testArray: [],
      testVal: undefined
    };

    this.state.applicationTypes =
      dropDownData[calculatorValues.manureSelected].dropDowns.application;
    this.state.qualityTypes =
      dropDownData[calculatorValues.manureSelected].dropDowns.quality;

    slider.sliderStartValue =
      dropDownData[calculatorValues.manureSelected].slider.maxValue / 2;
    calculatorValues.sliderValue =
      dropDownData[calculatorValues.manureSelected].slider.maxValue / 2;
    slider.sliderMaxValue =
      dropDownData[calculatorValues.manureSelected].slider.maxValue;
    slider.sliderUnit =
      dropDownData[calculatorValues.manureSelected].slider.metricUnit;

    const values = {};

    this.props.ManureStore.manures.forEach(o => {
      values[o.key] = o.name;
    });

    this.state.customQualityTypes = values;

    calculatorValues.applicationSelected = Object.keys(
      this.state.applicationTypes
    )[0];
    calculatorValues.soilSelected = Object.keys(this.soilType)[0];
    calculatorValues.cropSelected = Object.keys(this.cropType)[0];
    calculatorValues.seasonSelected = Object.keys(this.season)[0];
    calculatorValues.qualitySelected = Object.keys(this.state.qualityTypes)[0];
  }

  public componentDidMount() {
    this.SelectManure(calculatorValues.manureSelected);
  }

  public SelectManure(itemValue) {
    calculatorValues.manureSelected = itemValue;

    if (itemValue === "custom") {
      slider.sliderStartValue = 50;
      calculatorValues.sliderValue = 50;
      slider.sliderMaxValue = 100;
      slider.sliderUnit = "m3/ha";

      this.setState(
        {
          applicationTypes: [],
          qualityTypes: this.state.customQualityTypes
        },
        () => this.SliderValueChanged(calculatorValues.sliderValue)
      );
    } else {
      slider.sliderStartValue = dropDownData[itemValue].slider.maxValue / 2;
      calculatorValues.sliderValue =
        dropDownData[itemValue].slider.maxValue / 2;
      slider.sliderMaxValue = dropDownData[itemValue].slider.maxValue;
      slider.sliderUnit = dropDownData[itemValue].slider.metricUnit;
      this.setState(
        {
          applicationTypes: dropDownData[itemValue].dropDowns.application,
          qualityTypes: dropDownData[itemValue].dropDowns.quality
        },
        () => this.SliderValueChanged(calculatorValues.sliderValue)
      );
    }
  }

  public SliderValueChanged(value) {
    calculatorValues.sliderValue = value;

    const keys = [] as number[];
    for (const k in Images[calculatorValues.manureSelected]) {
      keys.push(Number(k));
    }

    const closestValue = this.closest(value, keys);
    if (calculatorValues.manureSelected == "custom") {
      this.setState({ image: Images.fym["50"] });
    } else {
      this.setState({
        image: Images[calculatorValues.manureSelected][closestValue]
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
    calculatorValues.applicationSelected = itemValue;
  }

  public render() {
    //  var manureApplicationTypes = {};
    return (
      <ScrollView>
        <View style={styles.container}>
          <StatusBar />
          <Text syle={styles.text}>Calculator for crap calculations.</Text>

          <Text>Manure Type</Text>
          <DropDown
            selectedValue={calculatorValues.manureSelected}
            onChange={item => this.SelectManure(item)}
            values={this.manureTypes}
          />

          <Text>Application Type</Text>
          <DropDown
            selectedValue={calculatorValues.applicationSelected}
            onChange={item => (calculatorValues.applicationSelected = item)}
            values={this.state.applicationTypes}
          />

          <Text>Soil Type</Text>
          <DropDown
            selectedValue={calculatorValues.soilSelected}
            onChange={item => (calculatorValues.soilSelected = item)}
            values={this.soilType}
          />
          <Text>Crop Type</Text>
          <DropDown
            selectedValue={calculatorValues.cropSelected}
            onChange={item => (calculatorValues.cropSelected = item)}
            values={this.cropType}
          />
          <Text>Season</Text>
          <DropDown
            selectedValue={calculatorValues.seasonSelected}
            onChange={item => (calculatorValues.seasonSelected = item)}
            values={this.season}
          />
          <Text>Quality</Text>
          <DropDown
            selectedValue={calculatorValues.qualitySelected}
            onChange={item => (calculatorValues.qualitySelected = item)}
            values={this.state.qualityTypes}
          />
          <View style={styles.container}>
            <Slider
              step={0.1}
              value={slider.sliderStartValue}
              onValueChange={val => this.SliderValueChanged(val)}
              maximumValue={slider.sliderMaxValue}
              thumbTintColor="rgb(252, 228, 149)"
              minimumTrackTintColor="#FF0000"
              maximumTrackTintColor="#206F98"
            />
            <Text>
              Value: {calculatorValues.sliderValue} {slider.sliderUnit}
            </Text>
          </View>

          <Image source={this.state.image} />
          <Text>Crop available nutrients(Total in manure)</Text>
          <Text>N {this.state.Nitrogen}</Text>
          <Text>P2O5 {this.state.Phosphorus}</Text>
          <Text>K2O {this.state.Potassium}</Text>
          <Text>Fertiliser Savings</Text>

          <Text>c{calculatorValues.ToString()}</Text>
          <Text>{calculatorStore.getPotassium()}</Text>
        </View>
      </ScrollView>
    );
  }
}
