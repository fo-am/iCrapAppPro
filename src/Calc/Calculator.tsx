import { inject, observer } from "mobx-react/native";
import {
  Col,
  Container,
  Content,
  Form,
  Grid,
  H1,
  H2,
  H3,
  Row,
  StyleProvider,
  Text
} from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Slider,
  StatusBar,
  TouchableOpacity,
  View
} from "react-native";

import images from "../assets/imageData";
import styles from "../styles/style";

import dropDownData from "../assets/dropDownData.json";

import CashDisplay from "../components/cashDisplay";
import DisplayAreaUnit from "../components/DisplayAreaUnit";
import FormatValue from "../components/displayNumber";
import DropDown from "../components/DropDown";
import SliderValues from "../model/sliderValues";

import Strings from "../assets/Strings";

interface Props {}

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
    CalculatorStore.calculatorValues.soilTestK = 0;
    CalculatorStore.calculatorValues.soilTestP = 0;
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
      <Container>
        <Content>
          <Form>
            <ScrollView>
              <View>
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
                  values={this.strings.manureTypes}
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
                  values={this.strings.soilType}
                />
                <Text>Crop Type</Text>
                <DropDown
                  selectedValue={CalculatorStore.calculatorValues.cropSelected}
                  onChange={item =>
                    (CalculatorStore.calculatorValues.cropSelected = item)
                  }
                  values={this.strings.calcCropType}
                />
                <Text>Season</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.seasonSelected
                  }
                  onChange={item =>
                    (CalculatorStore.calculatorValues.seasonSelected = item)
                  }
                  values={this.strings.season}
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
                <View>
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
                <Grid style={{ alignItems: "center" }}>
                  <Row>
                    <Text>Crop available nutrients(Total in manure)</Text>
                  </Row>
                  <Row>
                    <Col>
                      <Text style={{ fontSize: 20, lineHeight: 30 }}>
                        N <DisplayAreaUnit />
                      </Text>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: 20, lineHeight: 30 }}>
                        P<Text style={{ fontSize: 15, lineHeight: 40 }}>2</Text>
                        O<Text style={{ fontSize: 15, lineHeight: 40 }}>5</Text>{" "}
                        <DisplayAreaUnit />
                      </Text>
                    </Col>
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
                  </Row>
                  <Row>
                    <Col>
                      <Text>
                        <FormatValue
                          units={"UnitsAcre"}
                          value={CalculatorStore.nutrientResults.nitrogenTotal}
                        />{" "}
                        (
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            CalculatorStore.nutrientResults.nitrogenAvailable
                          }
                        />
                        )
                      </Text>
                    </Col>
                    <Col>
                      <Text>
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            CalculatorStore.nutrientResults.phosphorousTotal
                          }
                        />{" "}
                        (
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            CalculatorStore.nutrientResults.phosphorousAvailable
                          }
                        />
                        )
                      </Text>
                    </Col>
                    <Col>
                      <Text>
                        <FormatValue
                          units={"UnitsAcre"}
                          value={CalculatorStore.nutrientResults.potassiumTotal}
                        />{" "}
                        (
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            CalculatorStore.nutrientResults.potassiumAvailable
                          }
                        />
                        )
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <H2>Savings</H2>
                  </Row>
                  <Row>
                    <Col>
                      <CashDisplay
                        value={
                          CalculatorStore.nutrientResults.nitrogenAvailable *
                          0.79
                        }
                      />
                    </Col>
                    <Col>
                      <CashDisplay
                        value={
                          CalculatorStore.nutrientResults.phosphorousAvailable *
                          0.62
                        }
                      />
                    </Col>
                    <Col>
                      <CashDisplay
                        value={
                          CalculatorStore.nutrientResults.potassiumAvailable *
                          0.49
                        }
                      />
                    </Col>
                  </Row>
                </Grid>
              </View>
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }
}
