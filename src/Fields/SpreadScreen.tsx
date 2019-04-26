import { inject, observer } from "mobx-react/native";
import { Col, Footer, FooterTab, Grid, H1, Row } from "native-base";
import React, { Component } from "react";
import { Image, ScrollView, Slider, StatusBar, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import moment from "moment";
import Images from "../assets/imageData";

import DatePicker from "react-native-datepicker";
import dropDownData from "../assets/dropDownData.json";
import CashDisplay from "../components/cashDisplay";
import FormatValue from "../components/displayNumber";
import DropDown from "../components/DropDown";

import DisplayAreaUnit from "../components/DisplayAreaUnit";

import SliderValues from "../model/sliderValues";

import styles from "../styles/style";

import SpreadEvent from "../model/spreadEvent";

import Strings from "../assets/Strings";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  FarmStore: FarmStore;
  CalculatorStore: CalculatorStore;
  ManureStore: ManureStore;
  SettingsStore: SettingsStore;
}

interface State {}

const slider = new SliderValues();

@inject(
  "FieldStore",
  "CalculatorStore",
  "ManureStore",
  "SettingsStore",
  "FarmStore"
)
@observer
export default class SpreadScreen extends Component<Props, State> {
  private strings = new Strings();

  constructor(props: Props) {
    super(props);
    const { navigation, FieldStore, CalculatorStore, ManureStore } = this.props;
    const fieldKey = navigation.getParam("fieldKey", undefined);
    const spreadKey = navigation.getParam("spreadKey", undefined);

    if (spreadKey) {
      FieldStore.SetSpread(spreadKey).then(() => {
        this.setDropDowns(CalculatorStore.calculatorValues.manureSelected);
        this.dateToSeason(FieldStore.newSpreadEvent.date);
      });
    } else if (fieldKey) {
      FieldStore.newSpreadEvent = new SpreadEvent();
      FieldStore.SetField(fieldKey);
      FieldStore.newSpreadEvent.fieldkey = fieldKey;
      this.InitialiseDropdowns("fym");
      this.dateToSeason(FieldStore.newSpreadEvent.date);
    }

    const values = {};

    ManureStore.manures.forEach(o => {
      values[o.key] = o.name;
    });

    CalculatorStore.customQualityTypes = values;

    CalculatorStore.calculatorValues.soilTestK = FieldStore.field.soilTestK;
    CalculatorStore.calculatorValues.soilTestP = FieldStore.field.soilTestP;
    CalculatorStore.calculatorValues.soilTestMg = FieldStore.field.soilTestMg;
  }

  public componentWillMount() {}
  public setDropDowns(itemValue) {
    // use this if we are setting up a known spread event with the right values
    // drop down values are set in the FieldStore.SetSpread method

    const { CalculatorStore, SettingsStore } = this.props;

    if (itemValue === "custom") {
      slider.sliderStartValue = CalculatorStore.calculatorValues.sliderValue;
      slider.sliderMaxValue = 100;
      slider.sliderUnit =
        SettingsStore.appSettings.unit === "metric" ? "m3/ha" : "tons/acre";

      CalculatorStore.applicationTypes = [];
      CalculatorStore.qualityTypes = CalculatorStore.customQualityTypes;

      this.SliderValueChanged(CalculatorStore.calculatorValues.sliderValue);
    } else {
      slider.sliderStartValue = CalculatorStore.calculatorValues.sliderValue;

      slider.sliderMaxValue = dropDownData[itemValue].slider.maxValue;
      slider.sliderUnit = dropDownData[itemValue].slider.metricUnit;

      CalculatorStore.applicationTypes =
        dropDownData[itemValue].dropDowns.application;
      CalculatorStore.qualityTypes = dropDownData[itemValue].dropDowns.quality;

      this.SliderValueChanged(CalculatorStore.calculatorValues.sliderValue);
    }
  }

  public InitialiseDropdowns(itemValue) {
    // initialise other dropdowns when we select new manure type
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

    if (!Images[selectedManure]) {
      selectedManure = "fym";
    }

    const keys = [] as number[];
    for (const k in Images[selectedManure]) {
      keys.push(Number(k));
    }

    const closestValue = this.closest(value, keys);

    CalculatorStore.image = Images[selectedManure][closestValue];
  }

  public render() {
    const {
      FieldStore,
      CalculatorStore,
      SettingsStore,
      FarmStore
    } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView>
          <StatusBar barStyle="dark-content" />
          <View style={styles.narrow}>
            <Text style={styles.H1}>{FieldStore.field.name}</Text>
            <Text style={styles.text}>Enter new crap spreading event</Text>
            <Text style={styles.text}>Manure type</Text>
            <DropDown
              style={styles.outline}
              selectedValue={CalculatorStore.calculatorValues.manureSelected}
              onChange={item => this.InitialiseDropdowns(item)}
              values={this.strings.manureTypes}
            />
            <Text style={styles.text}>Date</Text>
            <DatePicker
              style={[styles.outline, { width: 200 }]}
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
              onDateChange={(datestr, date) => {
                //    FieldStore.newSpreadEvent.date = moment(date, "DD-MM-YYYY");
                this.dateToSeason(moment(date));
              }}
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
            <Text style={styles.text}>Application type</Text>
            <DropDown
              style={styles.outline}
              selectedValue={
                CalculatorStore.calculatorValues.applicationSelected
              }
              onChange={item =>
                (CalculatorStore.calculatorValues.applicationSelected = item)
              }
              values={CalculatorStore.applicationTypes}
            />

            <Image source={CalculatorStore.image} />
            <View style={{ marginVertical: 20 }}>
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
                Value:{" "}
                <FormatValue
                  units={slider.sliderUnit}
                  value={CalculatorStore.calculatorValues.sliderValue}
                />{" "}
                {slider.sliderUnit}
              </Text>
            </View>
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
                <Col>
                  <Text style={styles.text}>Crop Requirements</Text>
                </Col>
                <Col>
                  <Text style={styles.text}>Still needed</Text>
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
                    value={
                      CalculatorStore.nutrientResults.nitrogenAvailable *
                      FarmStore.farm.costN *
                      FieldStore.field.area
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.nitrogenRequirement
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.nitrogenRequirement -
                      CalculatorStore.nutrientResults.nitrogenTotal
                    }
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
                      CalculatorStore.nutrientResults.phosphorousAvailable *
                      FarmStore.farm.costP *
                      FieldStore.field.area
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.phosphorousRequirement
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.phosphorousRequirement -
                      CalculatorStore.nutrientResults.phosphorousTotal
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
                    value={
                      CalculatorStore.nutrientResults.potassiumAvailable *
                      FarmStore.farm.costK *
                      FieldStore.field.area
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.potassiumRequirement
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.potassiumRequirement -
                      CalculatorStore.nutrientResults.potassiumTotal
                    }
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
                    value={
                      CalculatorStore.nutrientResults.sulphurAvailable *
                      FarmStore.farm.costS *
                      FieldStore.field.area
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={FieldStore.cropRequirementsResult.sulphurRequirement}
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.sulphurRequirement -
                      CalculatorStore.nutrientResults.sulphurTotal
                    }
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
                    value={
                      CalculatorStore.nutrientResults.magnesiumAvailable *
                      FarmStore.farm.costMg *
                      FieldStore.field.area
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.magnesiumRequirement
                    }
                  />
                </Col>
                <Col>
                  <FormatValue
                    units={"UnitsAcre"}
                    value={
                      FieldStore.cropRequirementsResult.magnesiumRequirement -
                      CalculatorStore.nutrientResults.magnesiumTotal
                    }
                  />
                </Col>
              </Row>
            </Grid>
          </View>
          <Footer>
            <FooterTab>
              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.save()}
                title="Save Spread"
              />

              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.props.navigation.pop()}
                title="Cancel"
              />
            </FooterTab>
          </Footer>
        </ScrollView>
      </SafeAreaView>
    );
  }
  private save() {
    const { FieldStore } = this.props;

    FieldStore.SaveSpreadEvent();
    this.props.navigation.pop();
  }

  private dateToSeason(date: moment.Moment) {
    const { FieldStore, CalculatorStore } = this.props;

    const season = this.getSeason(
      parseInt(moment(date, "dd-mm-yyyy").format("M"), 10) + 1
    );
    FieldStore.newSpreadEvent.date = date;
    CalculatorStore.calculatorValues.seasonSelected = season;
    FieldStore.newSpreadEvent.season = season;
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
