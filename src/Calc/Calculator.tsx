import { inject, observer } from "mobx-react/native";
import { Col, Container, Content, Form, Grid, Row } from "native-base";
import React, { Component } from "react";
import { Image, ScrollView, Slider, StatusBar, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import images from "../assets/imageData";
import styles from "../styles/style";

import dropDownData from "../assets/dropDownData.json";

import CashDisplay from "../components/cashDisplay";
import DisplayAreaUnit from "../components/DisplayAreaUnit";
import FormatValue from "../components/displayNumber";
import DropDown from "../components/DropDown";
import SliderValues from "../model/sliderValues";

import Strings from "../assets/Strings";

import { NavigationScreenProp, SafeAreaView } from "react-navigation";

interface Props {
  ManureStore: ManureStore;
  CalculatorStore: CalculatorStore;
  SettingsStore: SettingsStore;
}

interface State {}

const slider = new SliderValues();

@inject("ManureStore", "SettingsStore", "CalculatorStore")
@observer
export default class Calculator extends Component<Props, State> {
  private strings: Strings = new Strings();

  constructor(props) {
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
      this.strings.soilType
    )[0];
    CalculatorStore.calculatorValues.cropSelected = Object.keys(
      this.strings.calcCropType
    )[0];
    CalculatorStore.calculatorValues.seasonSelected = Object.keys(
      this.strings.season
    )[0];
    CalculatorStore.calculatorValues.qualitySelected = Object.keys(
      CalculatorStore.qualityTypes
    )[0];
    CalculatorStore.calculatorValues.soilTestK = "soil-k-0";
    CalculatorStore.calculatorValues.soilTestP = "soil-p-0";
    CalculatorStore.calculatorValues.soilTestMg = "soil-m-0";
  }

  public componentDidMount() {
    const { CalculatorStore } = this.props;
    this.SelectManure(CalculatorStore.calculatorValues.manureSelected);
  }

  public SelectManure(itemValue) {
    const { CalculatorStore, SettingsStore } = this.props;
    CalculatorStore.calculatorValues.manureSelected = itemValue;

    if (itemValue === "custom") {
      slider.sliderStartValue = 50;
      CalculatorStore.calculatorValues.sliderValue = 50;
      slider.sliderMaxValue = 100;
      slider.sliderUnit =
        SettingsStore.appSettings.unit === "metric" ? "m3/ha" : "tons/acre";

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
    if (CalculatorStore.qualityTypes) {
      CalculatorStore.calculatorValues.qualitySelected = Object.keys(
        CalculatorStore.qualityTypes
      )[0];
    }
    if (CalculatorStore.applicationTypes) {
      CalculatorStore.calculatorValues.applicationSelected = Object.keys(
        CalculatorStore.applicationTypes
      )[0];
    }
  }

  public SliderValueChanged(value) {
    const { CalculatorStore } = this.props;

    CalculatorStore.calculatorValues.sliderValue = value;

    let selectedManure = CalculatorStore.calculatorValues.manureSelected;

    if (!images[selectedManure]) {
      selectedManure = "fym";
    }

    const keys = [] as number[];
    for (const k in images[selectedManure]) {
      keys.push(Number(k));
    }

    const closestValue = this.closest(value, keys);

    CalculatorStore.image = images[selectedManure][closestValue];
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.box}>
          <Text style={styles.H1}>Calculator for crap calculations.</Text>
          <Text style={styles.text}>Manure Type</Text>
          <DropDown
            style={styles.outline}
            selectedValue={CalculatorStore.calculatorValues.manureSelected}
            onChange={item => this.SelectManure(item)}
            values={this.strings.manureTypes}
          />
          <Text style={styles.text}>Application Type</Text>
          <DropDown
            style={styles.outline}
            selectedValue={CalculatorStore.calculatorValues.applicationSelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.applicationSelected = item)
            }
            values={CalculatorStore.applicationTypes}
          />
          <Text style={styles.text}>Soil Type</Text>
          <DropDown
            style={styles.outline}
            selectedValue={CalculatorStore.calculatorValues.soilSelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.soilSelected = item)
            }
            values={this.strings.soilType}
          />
          <Text style={styles.text}>Crop Type</Text>
          <DropDown
            style={styles.outline}
            selectedValue={CalculatorStore.calculatorValues.cropSelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.cropSelected = item)
            }
            values={this.strings.calcCropType}
          />
          <Text style={styles.text}>Season</Text>
          <DropDown
            style={styles.outline}
            selectedValue={CalculatorStore.calculatorValues.seasonSelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.seasonSelected = item)
            }
            values={this.strings.season}
          />
          <Text style={styles.text}>Quality</Text>
          <DropDown
            style={styles.outline}
            selectedValue={CalculatorStore.calculatorValues.qualitySelected}
            onChange={item =>
              (CalculatorStore.calculatorValues.qualitySelected = item)
            }
            values={CalculatorStore.qualityTypes}
          />

          <Slider
            step={0.1}
            value={slider.sliderStartValue}
            onValueChange={val => this.SliderValueChanged(val)}
            maximumValue={slider.sliderMaxValue}
            thumbTintColor="rgb(252, 228, 149)"
            minimumTrackTintColor="#FF0000"
            maximumTrackTintColor="#206F98"
          />

          <Text style={styles.text}>
            Amount:{" "}
            <FormatValue
              units={slider.sliderUnit}
              value={CalculatorStore.calculatorValues.sliderValue}
            />{" "}
            {slider.sliderUnit}
          </Text>

          <Input
            selectTextOnFocus={true}
            style={{ fontSize: 20, fontWeight: "bold" }}
            keyboardType="number-pad"
            placeholder="50"
            onChangeText={text => {
              slider.sliderStartValue = +text;
              this.SliderValueChanged(text);
            }}
          >
            <FormatValue
              units={slider.sliderUnit}
              value={CalculatorStore.calculatorValues.sliderValue}
            />
          </Input>

          <Image source={CalculatorStore.image} />

          <Text style={styles.H1}>Results</Text>

          <Grid style={{ alignItems: "center" }}>
            <Row style={styles.bottomBorder}>
              <Col>
                <Text style={styles.text}>Nutrient</Text>
              </Col>
              <Col>
                <Text style={styles.text}>Crop Avalable</Text>
              </Col>
              <Col>
                <Text style={styles.text}>Total In Manure</Text>
              </Col>
              <Col>
                <Text style={styles.text}>Savings</Text>
              </Col>
            </Row>
            <Row style={styles.bottomBorder}>
              <Col>
                <Text style={{ fontSize: 20, lineHeight: 30 }}>
                  N <DisplayAreaUnit />
                </Text>
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.nitrogenTotal}
                />
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.nitrogenAvailable}
                />
              </Col>
              <Col>
                <CashDisplay
                  value={CalculatorStore.nutrientResults.nitrogenTotal * 0.79}
                />
              </Col>
            </Row>
            <Row style={styles.bottomBorder}>
              <Col>
                <Text style={{ fontSize: 20, lineHeight: 30 }}>
                  P<Text style={{ fontSize: 15, lineHeight: 40 }}>2</Text>O
                  <Text style={{ fontSize: 15, lineHeight: 40 }}>5</Text>{" "}
                  <DisplayAreaUnit />
                </Text>
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.phosphorousTotal}
                />
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.phosphorousAvailable}
                />
              </Col>
              <Col>
                <CashDisplay
                  value={
                    CalculatorStore.nutrientResults.phosphorousTotal * 0.62
                  }
                />
              </Col>
            </Row>
            <Row style={styles.bottomBorder}>
              <Col>
                <Text style={{ fontSize: 20, lineHeight: 30 }}>
                  K
                  <Text
                    style={{
                      fontSize: 15,
                      lineHeight: 40
                    }}
                  >
                    2
                  </Text>
                  O <DisplayAreaUnit />
                </Text>
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.potassiumTotal}
                />
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.potassiumAvailable}
                />
              </Col>
              <Col>
                <CashDisplay
                  value={CalculatorStore.nutrientResults.potassiumTotal * 0.49}
                />
              </Col>
            </Row>
            <Row style={styles.bottomBorder}>
              <Col>
                <Text style={styles.text}>S</Text>
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.sulphurTotal}
                />
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.sulphurAvailable}
                />
              </Col>
              <Col>
                <CashDisplay
                  value={CalculatorStore.nutrientResults.potassiumTotal * 0}
                />
              </Col>
            </Row>
            <Row style={styles.bottomBorder}>
              <Col>
                <Text style={styles.text}>Mg</Text>
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.magnesiumTotal}
                />
              </Col>
              <Col>
                <FormatValue
                  units={"UnitsAcre"}
                  value={CalculatorStore.nutrientResults.magnesiumAvailable}
                />
              </Col>
              <Col>
                <CashDisplay
                  value={CalculatorStore.nutrientResults.magnesiumTotal * 0}
                />
              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
