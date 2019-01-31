import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  Slider,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProp } from "react-navigation";

import moment from "moment";
import Images from "../assets/imageData";

import DatePicker from "react-native-datepicker";
import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";

import Field from "../model/field";
import SliderValues from "../model/sliderValues";

import styles from "../styles/style";

import CalculatorStore from "../store/calculatorStore";
import Fieldstore from "../store/FieldsStore";
import ManureStore from "../store/manureStore";
import SettingsStore from "../store/settingsStore";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  CalculatorStore: CalculatorStore;
  ManureStore: ManureStore;
  SettingsStore: SettingsStore;
}

interface State {}

const slider = new SliderValues();

@inject("FieldStore", "CalculatorStore", "ManureStore", "SettingsStore")
@observer
export default class SpreadScreen extends Component<Props, State> {
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
  constructor(props: Props) {
    super(props);
    const { CalculatorStore, ManureStore } = this.props;
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

    ManureStore.manures.forEach(o => {
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
    CalculatorStore.calculatorValues.qualitySelected = Object.keys(
      CalculatorStore.qualityTypes
    )[0];
    CalculatorStore.calculatorValues.soilTestK = 0;
    CalculatorStore.calculatorValues.soilTestP = 0;
  }

  public componentWillMount() {
    const { navigation, FieldStore } = this.props;
    const item = navigation.getParam("fieldKey", undefined);
    if (item) {
      FieldStore.SetField(item);
    } else {
      FieldStore.reset();
    }
  }
  public componentDidMount() {
    this.SelectManure(
      this.props.CalculatorStore.calculatorValues.manureSelected
    );
  }
  public SelectManure(itemValue) {
    const { CalculatorStore } = this.props;
    CalculatorStore.calculatorValues.manureSelected = itemValue;

    if (itemValue === "custom") {
      slider.sliderStartValue = 50;
      CalculatorStore.calculatorValues.sliderValue = 50;
      slider.sliderMaxValue = 100;
      slider.sliderUnit = "m3/ha";

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
  public render() {
    const { FieldStore, CalculatorStore, SettingsStore } = this.props;
    return (
      <ScrollView>
        <StatusBar />
        <View style={styles.container}>
          <Text>{FieldStore.field.name}</Text>
          <Text>Enter new crap spreading event</Text>
          <Text>Manure type</Text>
          <DropDown
            selectedValue={CalculatorStore.calculatorValues.manureSelected}
            onChange={item => this.SelectManure(item)}
            values={this.manureTypes}
          />
          <Text>Date</Text>
          <DatePicker
            style={{ width: 200 }}
            date={FieldStore.newSpreadEvent.date}
            mode="date"
            format="DD-MM-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={date => this.dateToSeason(date)}
          />
          <Text>Quality</Text>
          <DropDown
            selectedValue={CalculatorStore.calculatorValues.qualitySelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.qualitySelected = item)
            }
            values={CalculatorStore.qualityTypes}
          />
          <Text>Application type</Text>
          <DropDown
            selectedValue={CalculatorStore.calculatorValues.applicationSelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.applicationSelected = item)
            }
            values={CalculatorStore.applicationTypes}
          />
          <Text>Ammount slider</Text>
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
              Value: {CalculatorStore.calculatorValues.sliderValue}{" "}
              {slider.sliderUnit}
            </Text>
          </View>
          <Text>Crop available nutrients(Total in manure)</Text>
          <Text>
            N Total{CalculatorStore.nutrientResults.nitrogenTotal} available (
            {CalculatorStore.nutrientResults.nitrogenAvailable}) Saving{" "}
            {CalculatorStore.nutrientResults.nitrogenAvailable *
              SettingsStore.NCost *
              FieldStore.field.area}
          </Text>
          <Text>
            P2O5 {CalculatorStore.nutrientResults.phosphorousTotal} available (
            {CalculatorStore.nutrientResults.phosphorousAvailable}) Saving{" "}
            {CalculatorStore.nutrientResults.phosphorousAvailable *
              SettingsStore.PCost *
              FieldStore.field.area}
          </Text>
          <Text>
            K2O {CalculatorStore.nutrientResults.potassiumTotal}available (
            {CalculatorStore.nutrientResults.potassiumAvailable}) Saving{" "}
            {CalculatorStore.nutrientResults.potassiumAvailable *
              SettingsStore.KCost *
              FieldStore.field.area}
          </Text>

          <Text>Crop nutrient requirements</Text>
          <Text>
            Nitrogen requirements
            {FieldStore.cropRequirementsResult.nitrogenRequirement}
          </Text>
          <Text>
            phosphorousRequirement requirements
            {FieldStore.cropRequirementsResult.phosphorousRequirement}
          </Text>
          <Text>
            potassiumRequirement requirements
            {FieldStore.cropRequirementsResult.potassiumRequirement}
          </Text>
          <Text>Nutrients still needed</Text>

          <Image source={CalculatorStore.image} />
        </View>
      </ScrollView>
    );
  }
  private dateToSeason(date: moment.Moment) {
    const { FieldStore, CalculatorStore } = this.props;
    FieldStore.newSpreadEvent.date = date;
    CalculatorStore.calculatorValues.seasonSelected = this.getSeason(
      parseInt(moment(date, "dd-mm-yyyy").format("M"), 10) + 1
    );
  }
  private getSeason(month: number) {
    switch (month) {
      case 12:
      case 1:
      case 2:
        return "winter";
      case 3:
      case 4:
      case 5:
        return "spring";
      case 6:
      case 7:
      case 8:
        return "summer";
      case 9:
      case 10:
      case 11:
        return "autumn";
    }
  }

  private closest(num: number, arr: Array<number>) {
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
}
