import { inject, observer } from "mobx-react/native";
import { Col, Footer, FooterTab, Grid, Row } from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import MapView, {
  MapEvent,
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

import ChartView from "react-native-highcharts";
import Strings from "../assets/Strings";
import { database } from "../database/Database";
import Field from "../model/field";

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
  showSave: boolean;
  showDraw: boolean;
  showHaveProps: boolean;

  graphData: any;
}

@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class FieldScreen extends Component<Props, State> {
  private strings: Strings;
  private prevRegion: Region | undefined = undefined;
  private areaUnits: string;
  private mapRef: MapView | null;

  constructor(props: Props) {
    super(props);
    this.strings = new Strings();

    const { CalculatorStore, SettingsStore, FarmStore } = this.props;
    this.areaUnits =
      SettingsStore.appSettings.unit == "metric" ? "hectares" : "acres";
    this.state = {
      marker: undefined,

      area: undefined,

      showSave: false,
      showDraw: true,
      showHaveProps: false,
      graphData: []
    };
    CalculatorStore.rainfall = FarmStore.farm.rainfall;
  }

  public componentWillMount() {
    const { navigation, FieldStore } = this.props;
    const fieldKey = navigation.getParam("fieldKey", undefined);
    const farmKey = navigation.getParam("farmKey", undefined);

    if (fieldKey) {
      FieldStore.SetField(fieldKey);
      this.getData(fieldKey);
    } else {
      FieldStore.reset(farmKey);
      this.getData(FieldStore.field.key);
    }
  }

  public render() {
    const { FieldStore } = this.props;

    let Highcharts = "Highcharts";
    const conf = {
      chart: {
        type: "column",
        animation: false,
        marginRight: 10,
        dateFormat: "dd/mm/YYYY"
      },
      title: {
        text: "Spread Events"
      },
      xAxis: {
        type: "datetime",
        tickPixelInterval: 50
      },
      yAxis: {
        title: {
          text: "Spread"
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
        enabled: true
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: this.state.graphData
    };

    const options = {};

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView scrollEnabled={!this.state.showSave}>
          <StatusBar barStyle="dark-content" />
          {/*
        // get current fields from data
        // show all fields on the map
        // on map show field name and area
        // on selct a field go to details page.
        // zoom map to that place

        */}
          <MapView
            ref={ref => (this.mapRef = ref)}
            onLayout={() => this.recenterOnLayoutChange()}
            style={[styles.map, this.fullSizeMap()]}
            provider={PROVIDER_GOOGLE}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
            toolbarEnabled={true}
            mapType={"satellite"}
            initialRegion={FieldStore.UpdateLocation()}
            region={this.setLocation()}
            onPress={e => this.mapPress(e)}
            onRegionChangeComplete={reg => (this.prevRegion = reg)}
          >
            {FieldStore.fields.map((field: Field) =>
              this.DrawFieldBoundry(field)
            )}
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
              <Marker
                coordinate={this.state.marker.coordinate}
                draggable={true}
                onDragEnd={(loc: MapEvent) => {
                  FieldStore.newField.coordinates.pop();
                  FieldStore.newField.coordinates.push(
                    loc.nativeEvent.coordinate
                  );
                }}
              />
            )}
          </MapView>
          <View
            style={{
              width: "50%",
              position: "absolute", // use absolute position to show button on top of the map
              alignSelf: "flex-end", // for align to right
              zIndex: 1
            }}
          >
            {!this.state.showSave && (
              <Button
                buttonStyle={[styles.roundButton]}
                titleStyle={styles.buttonText}
                onPress={() => this.draw()}
                title="Press To Draw Field"
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

                <Button
                  buttonStyle={[
                    styles.roundButton,
                    { backgroundColor: "green" }
                  ]}
                  titleStyle={styles.buttonText}
                  onPress={() => this.undo()}
                  title="Undo"
                />
              </View>
            )}
          </View>
          <View style={styles.narrow}>
            <Text style={[styles.H1, { textAlign: "center" }]}>
              {FieldStore.farm.name}
            </Text>

            <Input
              label="Field Name"
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              placeholder="Your Field"
              onChangeText={text => (FieldStore.field.name = text)}
            >
              {FieldStore.field.name}
            </Input>

            <Input
              label={"Field Size (" + this.areaUnits + ")"}
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onEndEditing={text => {
                this.ensureAreaValue(text);
              }}
            >
              {this.getAreaValue()}
            </Input>

            <Button
              buttonStyle={[styles.roundButton]}
              titleStyle={styles.buttonText}
              onPress={() => {
                FieldStore.Save().then(() => {
                  this.props.navigation.navigate("Spread", {
                    fieldKey: FieldStore.field.key
                  });
                });
              }}
              title="Add Spreading Event"
            />
          </View>
          <FlatList<SpreadEvent>
            style={styles.narrow}
            data={this.props.FieldStore.spreadEvents.slice()}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <Button
                buttonStyle={[
                  styles.roundButton,
                  styles.bgColourBlue,
                  { marginLeft: "5%", marginRight: "5%" }
                ]}
                titleStyle={styles.buttonText}
                onPress={() => {
                  FieldStore.Save().then(() => {
                    this.props.navigation.navigate("Spread", {
                      spreadKey: item.key
                    });
                  });
                }}
                title={item.date.format("DD-MM-YYYY")}
              />
            )}
          />
          <View style={styles.narrow}>
            <Text style={[styles.H2, { textAlign: "center" }]}>
              Soil Details
            </Text>
            <Text style={styles.H3}>Soil Type</Text>
            <DropDown
              style={styles.outline}
              selectedValue={FieldStore.field.soilType}
              onChange={item => (FieldStore.field.soilType = item)}
              values={this.strings.soilType}
            />

            <Text style={styles.H3}>Do you regularly add organic manures?</Text>

            <DropDown
              style={styles.outline}
              selectedValue={FieldStore.field.organicManure}
              onChange={item => (FieldStore.field.organicManure = item)}
              values={this.strings.yesno}
            />

            <Text style={styles.H3}>Result of soil tests (if available)</Text>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 0.3 }}>
                <Text style={styles.H3}>P</Text>
              </View>
              <View style={{ flex: 1 }}>
                <DropDown
                  style={styles.outline}
                  selectedValue={FieldStore.field.soilTestP}
                  onChange={item => (FieldStore.field.soilTestP = item)}
                  values={this.strings.soiltestP}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 0.3 }}>
                <Text style={styles.H3}>K</Text>
              </View>
              <View style={{ flex: 1 }}>
                <DropDown
                  style={styles.outline}
                  selectedValue={FieldStore.field.soilTestK}
                  onChange={item => (FieldStore.field.soilTestK = item)}
                  values={this.strings.soiltestK}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 0.3 }}>
                <Text style={styles.H3}>Mg</Text>
              </View>
              <View style={{ flex: 1 }}>
                <DropDown
                  style={styles.outline}
                  selectedValue={FieldStore.field.soilTestMg}
                  onChange={item => (FieldStore.field.soilTestMg = item)}
                  values={this.strings.soiltestMg}
                />
              </View>
            </View>

            <Grid style={{ alignItems: "center" }}>
              <Row>
                <Col>
                  <Text style={[styles.H3, { textAlign: "center" }]}>
                    Nitrogen Supply
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SoilNutrientDisplay
                    value={FieldStore.cropRequirementsResult.nitrogenSupply}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={[styles.H3, { textAlign: "center" }]}>
                    Sulphur Risk
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <View style={styles.outline}>
                    <Text style={[styles.H2, { textAlign: "center" }]}>
                      {FieldStore.CalculateSulphurRisk()}
                    </Text>
                  </View>
                </Col>
              </Row>
            </Grid>

            <Text style={[styles.H2, { textAlign: "center", marginTop: 20 }]}>
              Crop Details
            </Text>
            <Text style={styles.H3}>Previous crop type</Text>

            <DropDown
              style={styles.outline}
              selectedValue={FieldStore.field.prevCropType}
              onChange={(item: string) => {
                FieldStore.field.prevCropType = item;
                if (item.includes("grass")) {
                  FieldStore.field.recentGrass = "yes";
                }
              }}
              values={this.strings.prevCrop}
            />
            <Text style={styles.H3}>
              Have you grown grass in the last 3 years
            </Text>
            <DropDown
              style={styles.outline}
              selectedValue={FieldStore.field.recentGrass}
              onChange={item => (FieldStore.field.recentGrass = item)}
              values={this.strings.yesno}
            />
            <Text style={styles.H3}>Crop type</Text>
            <CropDisplay cropArray={FieldStore.field.cropType.slice()} />

            <Button
              buttonStyle={[styles.roundButton, { marginTop: 20 }]}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.navigate("CropSelector")}
              title="Select Field Crop"
            />

            <Grid>
              <Row>
                <Text style={styles.H2}>Crop Nutrient requirements</Text>
              </Row>
              <Row>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.text}>
                    N <DisplayAreaUnit />
                  </Text>
                </Col>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.text}>
                    P<Text style={styles.sub}>2</Text>O
                    <Text style={styles.sub}>5</Text> <DisplayAreaUnit />
                  </Text>
                </Col>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.text}>
                    K<Text style={styles.sub}>2</Text>
                    O <DisplayAreaUnit />
                  </Text>
                </Col>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.text}>
                    S <DisplayAreaUnit />
                  </Text>
                </Col>
                <Col
                  style={{
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.text}>
                    Mg <DisplayAreaUnit />
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.H3}>
                    {FieldStore.cropRequirementsResult.nitrogenRequirement}
                  </Text>
                </Col>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.H3}>
                    {FieldStore.cropRequirementsResult.phosphorousRequirement}
                  </Text>
                </Col>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.H3}>
                    {FieldStore.cropRequirementsResult.potassiumRequirement}
                  </Text>
                </Col>
                <Col
                  style={{
                    borderRightWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.H3}>
                    {FieldStore.cropRequirementsResult.sulphurRequirement}
                  </Text>
                </Col>
                <Col
                  style={{
                    backgroundColor: "white",
                    padding: 1
                  }}
                >
                  <Text style={styles.H3}>
                    {FieldStore.cropRequirementsResult.magnesiumRequirement}
                  </Text>
                </Col>
              </Row>
            </Grid>

            <View>
              <Text style={[styles.H2, { textAlign: "center" }]}>Graph</Text>
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

  public recenterOnLayoutChange(): any {
    const { FieldStore } = this.props;

    if (FieldStore.DataSource.length) {
      this.mapRef.fitToCoordinates(FieldStore.DataSource, {
        animated: false
      });
    }
  }
  private getData(fieldKey: string) {
    database
      .graphData(fieldKey)
      .then(data => this.setState({ graphData: data }));
  }

  private DrawFieldBoundry(field: Field) {
    if (field.fieldCoordinates.coordinates.slice().length > 0) {
      return (
        <Polygon
          key={field.key}
          geodesic={true}
          coordinates={field.fieldCoordinates.coordinates.slice()}
          strokeColor="rgba(8,190,45,0.5)"
          fillColor="rgba(8,190,45,0.25)"
          strokeWidth={1}
          tappable={false}
        />
      );
    }
  }
  private undo() {
    const { FieldStore } = this.props;
    if (FieldStore.newField.coordinates) {
      FieldStore.newField.coordinates.pop();
      this.setState({
        marker: {
          coordinate:
            FieldStore.newField.coordinates[
              FieldStore.newField.coordinates.length - 1
            ],
          key: id++
        }
      });
    }
  }
  private fullSizeMap() {
    if (this.state.showSave) {
      return {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height
      };
    }
  }
  private round(input: number): number {
    return Math.round(input * 100) / 100;
  }
  private getAreaValue(): number {
    const { FieldStore, SettingsStore } = this.props;
    if (SettingsStore.appSettings.unit !== "metric") {
      // ha to acres
      return this.round(FieldStore.field.area * 2.4710538146717);
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
    if (!this.state.showSave) {
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
      showSave: true
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
      showSave: false
    });
  }

  private cancel() {
    const { FieldStore } = this.props;
    FieldStore.newField.coordinates.length = 0;
    this.setState({
      marker: undefined,
      showSave: false
    });
  }

  private mapPress(e: any) {
    const { FieldStore } = this.props;
    if (this.state.showSave) {
      this.setState({
        marker: {
          coordinate: e.nativeEvent.coordinate,
          key: id++
        }
      });
      FieldStore.newField.id = "newField" + Date.now();
      FieldStore.newField.coordinates.push(e.nativeEvent.coordinate);
    }
  }
}
