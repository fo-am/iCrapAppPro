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

import Images from "../assets/imageData";

import DatePicker from "react-native-datepicker";
import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";

import Field from "../model/field";
import SliderValues from "../model/sliderValues";

import Styles from "../styles/style";

//import CalculatorStore from "../store/calculatorStore";
//import Fieldstore from "../store/FieldsStore";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  CalculatorStore: CalculatorStore;
}

interface State {}

const slider = new SliderValues();

@inject("FieldStore", "CalculatorStore")
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

  constructor(props: Props) {
    super(props);
    const { CalculatorStore } = this.props;
    CalculatorStore.calculatorValues.manureSelected = "fym";
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
    const { FieldStore, CalculatorStore } = this.props;
    return (
      <ScrollView style={Styles.container}>
        <StatusBar />
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
            // ... You can check the source to find the other keys.
          }}
          onDateChange={date => {
            FieldStore.newSpreadEvent.date = date;
          }}
        />
        <Text>Quality</Text>
        <Text>Application type</Text>
        <Text>Spread spread</Text>
        <Text>Ammount slider</Text>
        <View style={Styles.container}>
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
        <Image source={CalculatorStore.image} />
      </ScrollView>
    );
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
}
