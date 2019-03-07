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
  FlatList,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { NavigationScreenProp } from "react-navigation";

import CropDisplay from "../components/CropDisplay";
import DisplayAreaUnit from "../components/DisplayAreaUnit";
import DropDown from "../components/DropDown";
import SoilNutrientDisplay from "../components/soilNutrientDisplay";
import SphericalUtil from "../geoUtils";

import SpreadEvent from "../model/spreadEvent";

import moment from "moment";

// import SettingsStore from "../store/settingsStore";
import styles from "../styles/style";

import Strings from "../assets/Strings";

let id = 0;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  CalculatorStore: CalculatorStore;
  // SettingsStore: SettingsStore;
}

interface State {
  marker: any;

  area: any;
  mapMoveEnabled: boolean;
  showSave: boolean;
  showDraw: boolean;
  showHaveProps: boolean;
}

@inject("FieldStore", "CalculatorStore", "SettingsStore")
@observer
export default class FieldScreen extends Component<Props, State> {
  private strings: Strings;

  constructor(props: Props) {
    super(props);
    this.strings = new Strings();
    const { CalculatorStore, SettingsStore } = this.props;
    this.state = {
      marker: undefined,

      area: undefined,
      mapMoveEnabled: true,
      showSave: false,
      showDraw: true,
      showHaveProps: false
    };
    CalculatorStore.rainfall = SettingsStore.rainfall;
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
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView>
              <StatusBar />
              {/*
        // get current fields from data
        // show all fields on the map
        // on map show field name and area
        // on selct a field go to details page.
        // zoom map to that place

        */}
              <View>
                <H1>{FieldStore.farm.name}</H1>
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
                  onPress={e => this.onPress(e)}
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
                <Text>Scroll the map to locate your farm. </Text>
                <Text>
                  When ready to mark a field press the `Draw Field` button.
                </Text>
                {!this.state.showSave && (
                  <Form>
                    <Button onPress={() => this.draw()}>
                      <Text>Draw Field</Text>
                    </Button>
                  </Form>
                )}
                {this.state.showSave && (
                  <View>
                    <Button info onPress={() => this.save()}>
                      <Text>Save</Text>
                    </Button>
                    <Button warning onPress={() => this.cancel()}>
                      <Text>Cancel</Text>
                    </Button>
                    <Button info onPress={() => this.reset()}>
                      <Text>Reset</Text>
                    </Button>
                  </View>
                )}
                <Form style={{ paddingTop: "5%" }}>
                  <Item fixedLabel rounded>
                    <Label style={{ paddingLeft: "2%" }}>Field Name</Label>
                    <Input
                      selectTextOnFocus={true}
                      style={{ fontSize: 20, fontWeight: "bold" }}
                      placeholder="New Field"
                      onChangeText={text => (FieldStore.field.name = text)}
                    >
                      {FieldStore.field.name}
                    </Input>
                  </Item>

                  <Item fixedLabel rounded>
                    <Label style={{ paddingLeft: "2%" }}>Field Size</Label>
                    <Input
                      selectTextOnFocus={true}
                      style={{ fontSize: 20, fontWeight: "bold" }}
                      keyboardType="numeric"
                      placeholder="0"
                      onChangeText={text => (FieldStore.field.area = text)}
                    >
                      {FieldStore.field.area}
                    </Input>
                  </Item>
                </Form>
                <View style={{ paddingTop: "5%" }}>
                  <Button
                    onPress={() => {
                      FieldStore.Save();
                      this.props.navigation.navigate("Spread", {
                        fieldKey: FieldStore.field.key
                      });
                    }}
                  >
                    <Text>Add Spreading Event</Text>
                  </Button>
                  <View>
                    <ScrollView>
                      <FlatList<SpreadEvent>
                        data={this.props.FieldStore.spreadEvents.slice()}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (
                          <Button
                            onPress={() => {
                              this.props.navigation.navigate("Spread", {
                                spreadKey: item.key
                              });
                            }}
                          >
                            <Text>{item.date.format("DD-MM-YYYY")}</Text>
                          </Button>
                        )}
                      />
                    </ScrollView>
                  </View>
                </View>
                <View style={{ paddingTop: "5%" }}>
                  <H2>Soil Details</H2>
                  <H3>Soil Type</H3>
                  <DropDown
                    selectedValue={FieldStore.field.soilType}
                    onChange={item => (FieldStore.field.soilType = item)}
                    values={this.strings.soilType}
                  />
                  <H3>Do you regularly add organic manures?</H3>
                  <DropDown
                    selectedValue={FieldStore.field.organicManure}
                    onChange={item => (FieldStore.field.organicManure = item)}
                    values={this.strings.yesno}
                  />
                  <H3>Result of soil tests (if available)</H3>
                  <Text>P</Text>

                  <DropDown
                    selectedValue={FieldStore.field.soilTestP}
                    onChange={item => (FieldStore.field.soilTestP = item)}
                    values={this.strings.soiltestP}
                  />
                  <Text>K</Text>
                  <DropDown
                    selectedValue={FieldStore.field.soilTestK}
                    onChange={item => (FieldStore.field.soilTestK = item)}
                    values={this.strings.soiltestK}
                  />
                  <Grid>
                    <Row>
                      <H3
                        style={{
                          alignSelf: "center",
                          alignItems: "center"
                        }}
                      >
                        Nitrogen Supply
                      </H3>
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
                  </Grid>

                  <H2>Crop Details</H2>
                  <H3>Previous crop type</H3>

                  <DropDown
                    selectedValue={FieldStore.field.prevCropType}
                    onChange={item => (FieldStore.field.prevCropType = item)}
                    values={this.strings.prevCrop}
                  />
                  <H3>Have you grown grass in the last 3 years</H3>
                  <DropDown
                    selectedValue={FieldStore.field.recentGrass}
                    onChange={item => (FieldStore.field.recentGrass = item)}
                    values={this.strings.yesno}
                  />
                  <H3>Crop type</H3>
                  <CropDisplay cropArray={FieldStore.field.cropType.slice()} />
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate("CropSelector")
                    }
                  >
                    <Text>Crop Selector</Text>
                  </Button>

                  <Grid>
                    <Row>
                      <H2>Crop Nutrient requirements</H2>
                    </Row>
                    <Row>
                      <Col>
                        <Text style={{ fontSize: 20, lineHeight: 30 }}>
                          N <DisplayAreaUnit />
                        </Text>
                      </Col>
                      <Col>
                        <Text style={{ fontSize: 20, lineHeight: 30 }}>
                          P
                          <Text style={{ fontSize: 15, lineHeight: 40 }}>
                            2
                          </Text>
                          O
                          <Text style={{ fontSize: 15, lineHeight: 40 }}>
                            5
                          </Text>{" "}
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
                          {
                            FieldStore.cropRequirementsResult
                              .nitrogenRequirement
                          }
                        </Text>
                      </Col>
                      <Col>
                        <Text>
                          {
                            FieldStore.cropRequirementsResult
                              .phosphorousRequirement
                          }
                        </Text>
                      </Col>
                      <Col>
                        <Text>
                          {
                            FieldStore.cropRequirementsResult
                              .potassiumRequirement
                          }
                        </Text>
                      </Col>
                    </Row>
                  </Grid>
                </View>
                <View>
                  <H2>Graph</H2>
                  <Text>Oh no! Not yet :(</Text>
                </View>
              </View>
            </ScrollView>
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button rounded onPress={this.saveField}>
              <Text>Save</Text>
            </Button>
            <Button rounded onPress={() => this.props.navigation.goBack()}>
              <Text>Cancel</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
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

    const size = new SphericalUtil({}).ComputeSignedArea(
      FieldStore.newField.coordinates.slice()
    );

    FieldStore.SetFieldArea(size);
    FieldStore.SetCoordinates(FieldStore.newField);
    FieldStore.newField.coordinates.length = 0;

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
