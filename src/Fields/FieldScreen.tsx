import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  FooterTab,
  Form,
  H1,
  H2,
  H3,
  Header,
  Input,
  Item,
  Label,
  Left,
  Right,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { NavigationScreenProp } from "react-navigation";

import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";
import SoilNutrientDisplay from "../components/soilNutrientDisplay";
import SphericalUtil from "../geoUtils";
import Field from "../model/field";
import CalculatorStore from "../store/calculatorStore";
import FieldStore from "../store/FieldsStore";
// import SettingsStore from "../store/settingsStore";
import styles from "../styles/style";

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

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

@inject("FieldStore", "CalculatorStore", "SettingsStore")
@observer
export default class FieldScreen extends Component<Props, State> {
  public soilType = {
    sandyshallow: "Sandy/Shallow",
    peat: "Peat",
    organic: "Organic (10-20% organic matter)",
    mediumshallow: "Medium/Shallow",
    medium: "Medium",
    deepclay: "Deep clay",
    deepsilt: "Deep silt"
  };
  public yesno = {
    no: "No",
    yes: "Yes"
  };

  public crops = {
    cereals: "Cereals",
    oilseed: "Oilseed rape",
    potatoes: "Potatoes",
    sugarbeet: "Sugar beet",
    peas: "Peas",
    beans: "Beans",
    "low-n-veg": "Low N veg",
    "medium-n-veg": "Medium N veg",
    forage: "Forage crops (cut)",
    uncropped: "Uncropped land",
    "grass-low-n": "Grass (low N/1 or more cuts)",
    "grass-high-n": "Grass (3-5yr, high N, grazed)",
    "grass-other": "Any other grass"
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

  public soiltestP = {
    "soil-p-0": "0",
    "soil-p-1": "1",
    "soil-p-2": "2",
    "soil-p-3": "3"
  };

  public soiltestK = {
    "soil-k-0": "0",
    "soil-k-1": "1",
    "soil-k-2": "2",
    "soil-k-2+": "2+",
    "soil-k-3": "3"
  };

  constructor(props: Props) {
    super(props);
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
    const item = navigation.getParam("fieldKey", undefined);
    if (item) {
      FieldStore.SetField(item);
    } else {
      FieldStore.reset();
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
              <View style={styles.container}>
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
                  <View style={styles.container}>
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
                      placeholder="Rounded Textbox"
                      onChangeText={text => (FieldStore.field.name = text)}
                    >
                      {FieldStore.field.name}
                    </Input>
                  </Item>

                  <Item fixedLabel rounded>
                    <Label style={{ paddingLeft: "2%" }}>Field Size</Label>
                    <Input
                      keyboardType="numeric"
                      placeholder="Rounded Textbox"
                      onChangeText={text => (FieldStore.field.name = text)}
                    >
                      {FieldStore.field.area}
                    </Input>
                  </Item>
                </Form>
                <View style={{ paddingTop: "5%" }}>
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate("Spread", {
                        fieldKey: FieldStore.field.key
                      })
                    }
                  >
                    <Text>Add Spreading Event</Text>
                  </Button>
                </View>
                <View style={{ paddingTop: "5%" }}>
                  <H2>Soil Details</H2>
                  <H3>Soil Type</H3>
                  <DropDown
                    selectedValue={FieldStore.field.soilType}
                    onChange={item => (FieldStore.field.soilType = item)}
                    values={this.soilType}
                  />
                  <H3>Do you regularly add organic manures?</H3>
                  <DropDown
                    selectedValue={FieldStore.field.organicManure}
                    onChange={item => (FieldStore.field.organicManure = item)}
                    values={this.yesno}
                  />
                  <H3>Result of soil tests (if available)</H3>
                  <Text>P</Text>

                  <DropDown
                    selectedValue={FieldStore.field.soilTestP}
                    onChange={item => (FieldStore.field.soilTestP = item)}
                    values={this.soiltestP}
                  />
                  <Text>K</Text>
                  <DropDown
                    selectedValue={FieldStore.field.soilTestK}
                    onChange={item => (FieldStore.field.soilTestK = item)}
                    values={this.soiltestK}
                  />
                  <Text>
                    nitrogenSupply{" "}
                    <SoilNutrientDisplay
                      value={FieldStore.cropRequirementsResult.nitrogenSupply}
                    />
                  </Text>
                  <H2>Crop Details</H2>
                  <H3>Previous crop type</H3>
                  <DropDown
                    style={{ width: "90%" }}
                    selectedValue={FieldStore.field.prevCropType}
                    onChange={item => (FieldStore.field.prevCropType = item)}
                    values={this.crops}
                  />
                  <H3>Have you grown grass in the last 3 years</H3>
                  <DropDown
                    selectedValue={FieldStore.field.recentGrass}
                    onChange={item => (FieldStore.field.recentGrass = item)}
                    values={this.yesno}
                  />
                  <H3>Crop type</H3>
                  <DropDown
                    selectedValue={FieldStore.field.cropType}
                    onChange={item => (FieldStore.field.cropType = item)}
                    values={this.cropType}
                  />
                  <H2>Crop Nutrient requirements</H2>
                  <Text>Nitrogen requirements</Text>
                  <Text>
                    {FieldStore.cropRequirementsResult.nitrogenRequirement}
                  </Text>

                  <Text>phosphorousRequirement requirements</Text>
                  <Text>
                    {FieldStore.cropRequirementsResult.phosphorousRequirement}
                  </Text>

                  <Text>potassiumRequirement requirements</Text>
                  <Text>
                    {FieldStore.cropRequirementsResult.potassiumRequirement}
                  </Text>
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
            <Button
              rounded
              onPress={() => this.props.navigation.navigate("Home")}
            >
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
    this.props.navigation.navigate("Home");
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
      FieldStore.newField.id = "newField";
      FieldStore.newField.coordinates.push(e.nativeEvent.coordinate);
    }
  }
}
// https://github.com/mobxjs/mobx-react/issues/256#issuecomment-341419935
// https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
// https://mobx.js.org/best/pitfalls.html
//
