import { inject, observer } from "mobx-react/native";
import { Container, Content, Form, StyleProvider } from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
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

import dropDownData from "../assets/dropDownData.json";

import CashDisplay from "../components/cashDisplay";
import DisplayAreaUnit from "../components/DisplayAreaUnit";
import FormatValue from "../components/displayNumber";
import DropDown from "../components/DropDown";
import SliderValues from "../model/sliderValues";
// import CalculatorStore from "../store/calculatorStore";

import calculatorStore from "../store/calculatorStore";
// import SettingsStore from "../store/settingsStore";

interface Props {
  ManureStore: ManureStore;
  SettingsStore: SettingsStore;
  CalculatorStore: CalculatorStore;
}

interface State {}

const slider = new SliderValues();

@inject("ManureStore", "SettingsStore", "CalculatorStore")
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
    const { CalculatorStore } = this.props;
    CalculatorStore.calculatorValues.manureSelected = "fym";

    CalculatorStore.applicationTypes =
      dropDownData[
        CalculatorStore.calculatorValues.manureSelected
      ].dropDowns.application;
    CalculatorStore.qualityTypes =
      dropDownData[
        CalculatorStore.calculatorValues.manureSelected
      ].dropDowns.quality;

    slider.sliderStartValue =
      dropDownData[CalculatorStore.calculatorValues.manureSelected].slider
        .maxValue / 2;
    CalculatorStore.calculatorValues.sliderValue =
      dropDownData[CalculatorStore.calculatorValues.manureSelected].slider
        .maxValue / 2;
    slider.sliderMaxValue =
      dropDownData[
        CalculatorStore.calculatorValues.manureSelected
      ].slider.maxValue;
    slider.sliderUnit =
      dropDownData[
        CalculatorStore.calculatorValues.manureSelected
      ].slider.metricUnit;

    const values = {};

    this.props.ManureStore.manures.forEach(o => {
      values[o.key] = o.name;
    });

    CalculatorStore.customQualityTypes = values;

    CalculatorStore.calculatorValues.applicationSelected = Object.keys(
      CalculatorStore.applicationTypes
    )[0];
    CalculatorStore.calculatorValues.soilSelected = Object.keys(
      this.soilType
    )[0];
    CalculatorStore.calculatorValues.cropSelected = Object.keys(
      this.cropType
    )[0];
    CalculatorStore.calculatorValues.seasonSelected = Object.keys(
      this.season
    )[0];
    CalculatorStore.calculatorValues.qualitySelected = Object.keys(
      CalculatorStore.qualityTypes
    )[0];
    calculatorStore.calculatorValues.soilTestK = 0;
    calculatorStore.calculatorValues.soilTestP = 0;
  }

  public componentDidMount() {
    this.SelectManure(
      this.props.CalculatorStore.calculatorValues.manureSelected
    );
  }

  public SelectManure(itemValue) {
    const { CalculatorStore, SettingsStore } = this.props;
    CalculatorStore.calculatorValues.manureSelected = itemValue;

    if (itemValue === "custom") {
      slider.sliderStartValue = 50;
      CalculatorStore.calculatorValues.sliderValue = 50;
      slider.sliderMaxValue = 100;
      slider.sliderUnit =
        SettingsStore.appSettings.unit === "metric" ? "m3/ha" : "gallons/acre";

      CalculatorStore.applicationTypes = [];
      CalculatorStore.qualityTypes = CalculatorStore.customQualityTypes;

      this.SliderValueChanged(CalculatorStore.calculatorValues.sliderValue);
    } else {
      slider.sliderStartValue = dropDownData[itemValue].slider.maxValue / 2;
      CalculatorStore.calculatorValues.sliderValue =
        dropDownData[itemValue].slider.maxValue / 2;
      slider.sliderMaxValue = dropDownData[itemValue].slider.maxValue;
      slider.sliderUnit = dropDownData[itemValue].slider.metricUnit;

      CalculatorStore.applicationTypes =
        dropDownData[itemValue].dropDowns.application;
      CalculatorStore.qualityTypes = dropDownData[itemValue].dropDowns.quality;

      this.SliderValueChanged(CalculatorStore.calculatorValues.sliderValue);
    }
  }

  public SliderValueChanged(value) {
    const { CalculatorStore } = this.props;
    CalculatorStore.calculatorValues.sliderValue = value;

    const keys = [] as number[];
    for (const k in Images[CalculatorStore.calculatorValues.manureSelected]) {
      keys.push(Number(k));
    }

    const closestValue = this.closest(value, keys);
    if (CalculatorStore.calculatorValues.manureSelected == "custom") {
      CalculatorStore.image = Images.fym["50"];
    } else {
      CalculatorStore.image =
        Images[CalculatorStore.calculatorValues.manureSelected][closestValue];
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
    const { CalculatorStore } = this.props;
    CalculatorStore.calculatorValues.applicationSelected = itemValue;
  }

  public render() {
    const { SettingsStore, CalculatorStore } = this.props;
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView>
              <View style={styles.container}>
                <StatusBar />
                <Text style={styles.text}>
                  Calculator for crap calculations.
                </Text>

                <Text>Manure Type</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.manureSelected
                  }
                  onChange={item => this.SelectManure(item)}
                  values={this.manureTypes}
                />

                <Text>Application Type</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.applicationSelected
                  }
                  onChange={item =>
                    (CalculatorStore.calculatorValues.applicationSelected = item)
                  }
                  values={CalculatorStore.applicationTypes}
                />

                <Text>Soil Type</Text>
                <DropDown
                  selectedValue={CalculatorStore.calculatorValues.soilSelected}
                  onChange={item =>
                    (CalculatorStore.calculatorValues.soilSelected = item)
                  }
                  values={this.soilType}
                />
                <Text>Crop Type</Text>
                <DropDown
                  selectedValue={CalculatorStore.calculatorValues.cropSelected}
                  onChange={item =>
                    (CalculatorStore.calculatorValues.cropSelected = item)
                  }
                  values={this.cropType}
                />
                <Text>Season</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.seasonSelected
                  }
                  onChange={item =>
                    (CalculatorStore.calculatorValues.seasonSelected = item)
                  }
                  values={this.season}
                />
                <Text>Quality</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.qualitySelected
                  }
                  onChange={item =>
                    (CalculatorStore.calculatorValues.qualitySelected = item)
                  }
                  values={CalculatorStore.qualityTypes}
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
                    Value:{" "}
                    <FormatValue
                      units={slider.sliderUnit}
                      value={CalculatorStore.calculatorValues.sliderValue}
                    />{" "}
                    {slider.sliderUnit}
                  </Text>
                </View>

                <Image source={CalculatorStore.image} />
                <Text>Crop available nutrients(Total in manure)</Text>
                <Text>
                  N <DisplayAreaUnit /> Total
                  <FormatValue
                    units={"UnitsAcre"}
                    value={CalculatorStore.nutrientResults.nitrogenTotal}
                  />{" "}
                  available (
                  <FormatValue
                    units={"UnitsAcre"}
                    value={CalculatorStore.nutrientResults.nitrogenAvailable}
                  />
                  ) Saving{" "}
                  <CashDisplay
                    value={
                      CalculatorStore.nutrientResults.nitrogenAvailable *
                      SettingsStore.NCost
                    }
                  />
                </Text>
                <Text>
                  P2O5 <DisplayAreaUnit />
                  <FormatValue
                    units={"UnitsAcre"}
                    value={CalculatorStore.nutrientResults.phosphorousTotal}
                  />{" "}
                  available (
                  <FormatValue
                    units={"UnitsAcre"}
                    value={CalculatorStore.nutrientResults.phosphorousAvailable}
                  />
                  ) Saving{" "}
                  <CashDisplay
                    value={
                      CalculatorStore.nutrientResults.phosphorousAvailable *
                      SettingsStore.PCost
                    }
                  />
                </Text>
                <Text>
                  K2O <DisplayAreaUnit />
                  <FormatValue
                    units={"UnitsAcre"}
                    value={CalculatorStore.nutrientResults.potassiumTotal}
                  />{" "}
                  available (
                  <FormatValue
                    units={"UnitsAcre"}
                    value={CalculatorStore.nutrientResults.potassiumAvailable}
                  />
                  ) Saving{" "}
                  <CashDisplay
                    value={
                      CalculatorStore.nutrientResults.potassiumAvailable *
                      SettingsStore.KCost
                    }
                  />
                </Text>
              </View>
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }
}
