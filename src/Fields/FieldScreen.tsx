import { inject, observer } from "mobx-react/native";
import { Col, Footer, FooterTab, Grid, Row } from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, {
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
  Region
} from "react-native-maps";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import CropDisplay from "../components/CropDisplay";
import DisplayAreaUnit from "../components/DisplayAreaUnit";
import DropDown from "../components/DropDown";
import SoilNutrientDisplay from "../components/soilNutrientDisplay";
import SphericalUtil from "../geoUtils";

import SpreadEvent from "../model/spreadEvent";

import { Button, Input } from "react-native-elements";
import styles from "../styles/style";

import Strings from "../assets/Strings";

import ChartView from "react-native-highcharts";

let id = 0;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  CalculatorStore: CalculatorStore;
  SettingsStore: SettingsStore;
  FarmStore: FarmStore;
}

interface State {
  marker: any;

  area: any;
  mapMoveEnabled: boolean;
  showSave: boolean;
  showDraw: boolean;
  showHaveProps: boolean;
}

@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class FieldScreen extends Component<Props, State> {
  private strings: Strings;
  private prevRegion: Region | undefined = undefined;
  private areaUnits: string;

  constructor(props: Props) {
    super(props);
    this.strings = new Strings();
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
    this.areaUnits =
      SettingsStore.appSettings.unit == "metric" ? "hectares" : "acres";
    this.state = {
      marker: undefined,

      area: undefined,
      mapMoveEnabled: true,
      showSave: false,
      showDraw: true,
      showHaveProps: false
    };
    CalculatorStore.rainfall = FarmStore.farm.rainfall;
  }

  public componentWillMount() {
    const { navigation, FieldStore } = this.props;
    const fieldKey = navigation.getParam("fieldKey", undefined);
    const farmKey = navigation.getParam("farmKey", undefined);

    if (fieldKey) {
      FieldStore.SetField(fieldKey);
    } else {
      FieldStore.reset(farmKey);
    }
  }
  public render() {
    const { FieldStore } = this.props;

    const Highcharts = "Highcharts";
    const conf = {
      chart: {
        type: "spline",
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load() {
            // set up the updating of the chart each second
            const series = this.series[0];
            setInterval(function() {
              const x = new Date().getTime(), // current time
                y = Math.random();
              series.addPoint([x, y], true, true);
            }, 1000);
          }
        }
      },
      title: {
        text: "Live random data"
      },
      xAxis: {
        type: "datetime",
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: "Value"
        },
        plotLines: [
          {
            value: 0,
            width: 1,
            color: "#808080"
          }
        ]
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [
        {
          name: "Random data",
          data: (function() {
            // generate an array of random data
            const data = [];
            const time = new Date().getTime();

            for (let i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: Math.random()
              });
            }
            return data;
          })()
        }
      ]
    };

    const options = {
      global: {
        useUTC: false
      },
      lang: {
        decimalPoint: ".",
        thousandsSep: ","
      }
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView>
          <StatusBar />
          {/*
        // get current fields from data
        // show all fields on the map
        // on map show field name and area
        // on selct a field go to details page.
        // zoom map to that place

        */}
          <Text style={[styles.H1, { textAlign: "center" }]}>
            {FieldStore.farm.name}
          </Text>
          <MapView
            style={styles.map}
            scrollEnabled={this.state.mapMoveEnabled}
            provider={PROVIDER_GOOGLE}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
            toolbarEnabled={true}
            mapType={"satellite"}
            initialRegion={FieldStore.UpdateLocation()}
            region={this.setLocation()}
            onPress={e => this.onPress(e)}
            onRegionChangeComplete={reg => (this.prevRegion = reg)}
          >
            {FieldStore.DataSource.length > 0 && (
              <Polygon
                geodesic={true}
                key={FieldStore.field.fieldCoordinates.id}
                coordinates={FieldStore.DataSource}
                strokeColor="rgba(8,190,45,1)"
                fillColor="rgba(8,190,45,0.5)"
                strokeWidth={1}
                tappable={false}
              />
            )}

            {FieldStore.newField.coordinates.length > 0 && (
              <Polygon
                geodesic={true}
                key={FieldStore.newField.id}
                coordinates={FieldStore.newField.coordinates.slice()}
                strokeColor="#000"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={1}
                tappable={false}
              />
            )}
            {this.state.marker && (
              <Marker coordinate={this.state.marker.coordinate} />
            )}
          </MapView>
          <Text style={styles.text}>
            To mark a field press the `Draw Field` button.
          </Text>
          {!this.state.showSave && (
            <Button
              buttonStyle={[styles.roundButton]}
              titleStyle={styles.buttonText}
              onPress={() => this.draw()}
              title="Draw Field"
            />
          )}
          {this.state.showSave && (
            <View>
              <Button
                buttonStyle={[styles.roundButton, styles.bgColourBlue]}
                titleStyle={styles.buttonText}
                onPress={() => this.save()}
                title="Save"
              />

              <Button
                buttonStyle={[styles.roundButton, styles.bgColourRed]}
                titleStyle={styles.buttonText}
                onPress={() => this.cancel()}
                title="Cancel"
              />
            </View>
          )}
          <View>
            <Input
              label="Field Name"
              selectTextOnFocus={true}
              style={{ fontSize: 20, fontWeight: "bold" }}
              placeholder="Your Field"
              onChangeText={text => (FieldStore.field.name = text)}
            >
              {FieldStore.field.name}
            </Input>

            <Input
              label={"Field Size (" + this.areaUnits + ")"}
              selectTextOnFocus={true}
              style={{ fontSize: 20, fontWeight: "bold" }}
              keyboardType="numeric"
              placeholder="0"
              onEndEditing={text => {
                this.ensureAreaValue(text);
              }}
            >
              {this.getAreaValue()}
            </Input>

            <View style={{ paddingTop: "5%" }}>
              <Button
                onPress={() => {
                  FieldStore.Save().then(() => {
                    this.props.navigation.navigate("Spread", {
                      fieldKey: FieldStore.field.key
                    });
                  });
                }}
              >
                <Text style={styles.text}>Add Spreading Event</Text>
              </Button>
              <View>
                <ScrollView>
                  <FlatList<SpreadEvent>
                    data={this.props.FieldStore.spreadEvents.slice()}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                      <Button
                        onPress={() => {
                          FieldStore.Save().then(() => {
                            this.props.navigation.navigate("Spread", {
                              spreadKey: item.key
                            });
                          });
                        }}
                      >
                        <Text style={styles.text}>
                          {item.date.format("DD-MM-YYYY")}
                        </Text>
                      </Button>
                    )}
                  />
                </ScrollView>
              </View>
            </View>
            <View style={{ paddingTop: "5%" }}>
              <Text style={styles.H2}>Soil Details</Text>
              <Text style={styles.H3}>Soil Type</Text>
              <DropDown
                selectedValue={FieldStore.field.soilType}
                onChange={item => (FieldStore.field.soilType = item)}
                values={this.strings.soilType}
              />
              <Text style={styles.H3}>
                Do you regularly add organic manures?
              </Text>
              <DropDown
                selectedValue={FieldStore.field.organicManure}
                onChange={item => (FieldStore.field.organicManure = item)}
                values={this.strings.yesno}
              />
              <Text style={styles.H3}>Result of soil tests (if available)</Text>
              <Text style={styles.text}>P</Text>

              <DropDown
                selectedValue={FieldStore.field.soilTestP}
                onChange={item => (FieldStore.field.soilTestP = item)}
                values={this.strings.soiltestP}
              />
              <Text style={styles.text}>K</Text>

              <DropDown
                selectedValue={FieldStore.field.soilTestK}
                onChange={item => (FieldStore.field.soilTestK = item)}
                values={this.strings.soiltestK}
              />

              <Text style={styles.text}>Mg</Text>

              <DropDown
                selectedValue={FieldStore.field.soilTestMg}
                onChange={item => (FieldStore.field.soilTestMg = item)}
                values={this.strings.soiltestMg}
              />
              <Grid style={{ alignItems: "center" }}>
                <Row>
                  <Text style={styles.H3}>Nitrogen Supply</Text>
                </Row>
                <Row
                  style={{
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <SoilNutrientDisplay
                    value={FieldStore.cropRequirementsResult.nitrogenSupply}
                  />
                </Row>

                <Row>
                  <Text style={styles.H3}>Sulphur Risk</Text>
                </Row>
                <Row
                  style={{
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.text}>
                    {FieldStore.CalculateSulphurRisk()}
                  </Text>
                </Row>
              </Grid>

              <Text style={styles.H2}>Crop Details</Text>
              <Text style={styles.H3}>Previous crop type</Text>

              <DropDown
                selectedValue={FieldStore.field.prevCropType}
                onChange={item => (FieldStore.field.prevCropType = item)}
                values={this.strings.prevCrop}
              />
              <Text style={styles.H3}>
                Have you grown grass in the last 3 years
              </Text>
              <DropDown
                selectedValue={FieldStore.field.recentGrass}
                onChange={item => (FieldStore.field.recentGrass = item)}
                values={this.strings.yesno}
              />
              <Text style={styles.H3}>Crop type</Text>
              <CropDisplay cropArray={FieldStore.field.cropType.slice()} />
              <Button
                onPress={() => this.props.navigation.navigate("CropSelector")}
              >
                <Text style={styles.text}>Crop Selector</Text>
              </Button>

              <Grid>
                <Row>
                  <Text style={styles.H2}>Crop Nutrient requirements</Text>
                </Row>
                <Row>
                  <Col>
                    <Text style={{ fontSize: 20, lineHeight: 30 }}>
                      N <DisplayAreaUnit />
                    </Text>
                  </Col>
                  <Col>
                    <Text style={{ fontSize: 20, lineHeight: 30 }}>
                      P<Text style={{ fontSize: 15, lineHeight: 40 }}>2</Text>O
                      <Text style={{ fontSize: 15, lineHeight: 40 }}>5</Text>
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
                  <Col>
                    <Text style={styles.text}>s</Text>
                  </Col>
                  <Col>
                    <Text style={styles.text}>mg</Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={styles.text}>
                      {FieldStore.cropRequirementsResult.nitrogenRequirement}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.text}>
                      {FieldStore.cropRequirementsResult.phosphorousRequirement}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.text}>
                      {FieldStore.cropRequirementsResult.potassiumRequirement}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.text}>
                      {FieldStore.cropRequirementsResult.sulphurRequirement}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.text}>
                      {FieldStore.cropRequirementsResult.magnesiumRequirement}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </View>
            <View>
              <Text style={styles.H2}>Graph</Text>
              {
                // https://github.com/TradingPal/react-native-highcharts
              }
              <ChartView
                style={{ height: 300 }}
                config={conf}
                options={options}
              />
            </View>
          </View>
          <Footer>
            <FooterTab>
              <Button
                buttonStyle={[styles.footerButton]}
                titleStyle={styles.buttonText}
                onPress={this.saveField}
                title="Save Field"
              />
              <Button
                buttonStyle={[styles.footerButton]}
                titleStyle={styles.buttonText}
                onPress={() => this.props.navigation.goBack()}
                title="Cancel"
              />
            </FooterTab>
          </Footer>
        </ScrollView>
      </SafeAreaView>
    );
  }

  private getAreaValue(): number {
    const { FieldStore, SettingsStore } = this.props;
    if (SettingsStore.appSettings.unit !== "metric") {
      // ha to acres
      return FieldStore.field.area * 2.4710538146717;
    }
    return FieldStore.field.area;
  }
  private ensureAreaValue(input) {
    const { FieldStore, SettingsStore } = this.props;
    if (SettingsStore.appSettings.unit !== "metric") {
      // acres to ha
      FieldStore.field.area = input.nativeEvent.text * 0.404686;
    }
    FieldStore.field.area = input.nativeEvent.text;
  }

  private setLocation(): Region | undefined {
    const { FieldStore } = this.props;
    if (this.state.mapMoveEnabled) {
      this.prevRegion = FieldStore.UpdateLocation();
      return this.prevRegion;
    } else {
      return this.prevRegion;
    }
  }

  private saveField = () => {
    const { FieldStore } = this.props;
    FieldStore.Save();
    this.props.navigation.goBack();
  };

  private draw() {
    this.setState({
      showSave: true,
      mapMoveEnabled: false
    });
  }
  private save() {
    const { marker, area } = this.state;
    const { FieldStore } = this.props;

    if (FieldStore.newField.coordinates.length != 0) {
      const size = new SphericalUtil({}).ComputeSignedArea(
        FieldStore.newField.coordinates.slice()
      );

      FieldStore.SetFieldArea(size);
      FieldStore.SetCoordinates(FieldStore.newField);
      FieldStore.newField.coordinates.length = 0;
    }

    this.setState({
      marker: undefined,
      showSave: false,
      mapMoveEnabled: true
    });
    // save to file
  }
  private cancel() {
    const { FieldStore } = this.props;
    FieldStore.newField.coordinates.length = 0;
    this.setState({
      marker: undefined,
      mapMoveEnabled: true,
      showSave: false
    });
  }
  private reset() {
    const { FieldStore } = this.props;
    FieldStore.newField.coordinates.id = "delete";
    FieldStore.newField.coordinates.length = 0;
    this.setState({
      marker: undefined,
      mapMoveEnabled: true
    });
  }

  private onPress(e: any) {
    const { FieldStore } = this.props;
    if (this.state.showSave) {
      this.setState({
        marker: {
          coordinate: e.nativeEvent.coordinate,
          key: id++
        },
        mapMoveEnabled: false
      });
      FieldStore.newField.id = "newField" + Date.now();
      FieldStore.newField.coordinates.push(e.nativeEvent.coordinate);
    }
  }
}
// https://github.com/mobxjs/mobx-react/issues/256#issuecomment-341419935
// https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
// https://mobx.js.org/best/pitfalls.html
//
