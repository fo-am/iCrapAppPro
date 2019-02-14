import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Col,
  Container,
  Content,
  Footer,
  FooterTab,
  Form,
  Grid,
  H1,
  H2,
  H3,
  Header,
  Input,
  Item,
  Label,
  Left,
  Right,
  Row,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Slider,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProp } from "react-navigation";

import moment from "moment";
import Images from "../assets/imageData";

import DatePicker from "react-native-datepicker";
import dropDownData from "../assets/dropDownData.json";
import CashDisplay from "../components/cashDisplay";
import FormatValue from "../components/displayNumber";
import DropDown from "../components/DropDown";

import DisplayAreaUnit from "../components/DisplayAreaUnit";

import Field from "../model/field";
import SliderValues from "../model/sliderValues";

import styles from "../styles/style";

import CalculatorStore from "../store/calculatorStore";
// import Fieldstore from "../store/FieldsStore";
import ManureStore from "../store/manureStore";
import SettingsStore from "../store/settingsStore";
import FieldsStore from "../store/FieldsStore";
import SpreadEvent from "../model/spreadEvent";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
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
    const fieldKey = navigation.getParam("fieldKey", undefined);
    const spreadKey = navigation.getParam("spreadKey", undefined);

    if (spreadKey) {
      FieldStore.SetSpread(spreadKey);
    } else if (fieldKey) {
      FieldsStore.newSpreadEvent = new SpreadEvent();
      FieldStore.SetField(fieldKey);
      FieldsStore.newSpreadEvent.fieldkey = fieldKey;
    }
  }

  public componentDidMount() {
    this.SelectManure(
      this.props.CalculatorStore.calculatorValues.manureSelected
    );
    this.dateToSeason(this.props.FieldStore.newSpreadEvent.date);
  }

  public SelectManure(itemValue) {
    const { CalculatorStore } = this.props;
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
  }

  public SliderValueChanged(value) {
    const { CalculatorStore } = this.props;

    CalculatorStore.calculatorValues.sliderValue = value;

    let selectedManure = CalculatorStore.calculatorValues.manureSelected;

    if (selectedManure === "custom") {
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
      <Container>
        <Content>
          <Form>
            <ScrollView>
              <StatusBar />
              <View style={styles.container}>
                <H1>{FieldStore.field.name}</H1>
                <Text>Enter new crap spreading event</Text>
                <Text>Manure type</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.manureSelected
                  }
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
                  selectedValue={
                    CalculatorStore.calculatorValues.qualitySelected
                  }
                  onChange={item =>
                    (CalculatorStore.calculatorValues.qualitySelected = item)
                  }
                  values={CalculatorStore.qualityTypes}
                />
                <Text>Application type</Text>
                <DropDown
                  selectedValue={
                    CalculatorStore.calculatorValues.applicationSelected
                  }
                  onChange={item =>
                    (CalculatorStore.calculatorValues.applicationSelected = item)
                  }
                  values={CalculatorStore.applicationTypes}
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

                <Grid>
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
                        />
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
                        />
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
                        />
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
                    <Text>Savings</Text>
                  </Row>
                  <Row>
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
                      <CashDisplay
                        value={
                          CalculatorStore.nutrientResults.phosphorousAvailable *
                          FarmStore.farm.costP *
                          FieldStore.field.area
                        }
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
                  </Row>
                  <Row>
                    <Text>Crop nutrient requirements</Text>
                  </Row>

                  <Row>
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
                          FieldStore.cropRequirementsResult
                            .phosphorousRequirement
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
                  </Row>
                  <Row>
                    <Text>Nutrients still needed</Text>
                  </Row>
                  <Row>
                    <Col>
                      <Text>
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            FieldStore.cropRequirementsResult
                              .nitrogenRequirement -
                            CalculatorStore.nutrientResults.nitrogenTotal
                          }
                        />
                      </Text>
                    </Col>
                    <Col>
                      <Text>
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            FieldStore.cropRequirementsResult
                              .phosphorousRequirement -
                            CalculatorStore.nutrientResults.phosphorousTotal
                          }
                        />
                      </Text>
                    </Col>
                    <Col>
                      <Text>
                        <FormatValue
                          units={"UnitsAcre"}
                          value={
                            FieldStore.cropRequirementsResult
                              .phosphorousRequirement -
                            CalculatorStore.nutrientResults.phosphorousTotal
                          }
                        />
                      </Text>
                    </Col>
                  </Row>
                </Grid>

                <Image source={CalculatorStore.image} />
              </View>
            </ScrollView>
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button rounded onPress={() => this.save()}>
              <Text>Save</Text>
            </Button>
            <Button rounded onPress={() => this.props.navigation.pop()}>
              <Text>Cancel</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
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
