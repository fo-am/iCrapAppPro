import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { NavigationScreenProp } from "react-navigation";

import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";
import SphericalUtil from "../geoUtils";
import Field from "../model/field";
import FieldStore from "../store/FieldsStore";
import Styles from "../styles/style";

let id = 0;

interface Props {
  navigation: NavigationScreenProp<any, any>;
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

@inject("FieldStore")
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
  constructor(props: Props) {
    super(props);
    this.state = {
      marker: undefined,

      area: undefined,
      mapMoveEnabled: true,
      showSave: false,
      showDraw: true,
      showHaveProps: false
    };
  }

  public componentWillMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("fieldKey", undefined);
    if (item) {
      FieldStore.SetField(item);
    } else {
      FieldStore.reset();
    }
  }
  public render() {
    return (
      <ScrollView style={Styles.container}>
        <StatusBar />
        {/*
        // get current fields from data
        // show all fields on the map
        // on map show field name and area
        // on selct a field go to details page.
        // zoom map to that place

        */}

        <Text>
          Scroll around and find your field, when ready to mark a field press
          the `Draw` button.
        </Text>
        <MapView
          style={Styles.map}
          scrollEnabled={this.state.mapMoveEnabled}
          provider={"google"}
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
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
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
        {!this.state.showSave && (
          <View>
            <TouchableOpacity
              onPress={() => this.draw()}
              style={[Styles.bubble, Styles.button]}
            >
              <Text>Draw</Text>
            </TouchableOpacity>
          </View>
        )}
        {this.state.showSave && (
          <View>
            <TouchableOpacity
              onPress={() => this.save()}
              style={[Styles.bubble, Styles.button]}
            >
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cancel()}
              style={[Styles.bubble, Styles.button]}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.reset()}
              style={[Styles.bubble, Styles.button]}
            >
              <Text>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text>Field Name</Text>
        <TextInput
          style={{ fontSize: 20, fontWeight: "bold" }}
          onChangeText={text => (FieldStore.field.name = text)}
        >
          {FieldStore.field.name}
        </TextInput>
        <Text>Field Size</Text>
        <TextInput
          keyboardType="numeric"
          style={{ fontSize: 20, fontWeight: "bold" }}
          onChangeText={text => (FieldStore.field.area = text)}
        >
          {FieldStore.field.area}
        </TextInput>
        <View>
          <Text>Add Spread</Text>
          <Button
            title="Add Spreading Event"
            onPress={() =>
              this.props.navigation.navigate("Spread", {
                fieldKey: FieldStore.field.key
              })
            }
          />
        </View>
        <View>
          <Text>Soil Details</Text>
          <Text>Soil Type</Text>
          <DropDown
            selectedValue={FieldStore.field.soilType}
            onChange={item => (FieldStore.field.soilType = item)}
            values={this.soilType}
          />
          <Text>Do you regularly add organic manures?</Text>
          <DropDown
            selectedValue={FieldStore.field.organicManure}
            onChange={item => (FieldStore.field.organicManure = item)}
            values={this.yesno}
          />
          <Text>Result of soil tests (if available)</Text>
          <Text>P</Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={text => (FieldStore.field.soilTestP = text)}
          >
            {FieldStore.field.soilTestP}
          </TextInput>
          <Text>K</Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={text => (FieldStore.field.soilTestK = text)}
          >
            {FieldStore.field.soilTestK}
          </TextInput>
          <TextInput>Here goes the soil N supply calculation</TextInput>
        </View>
        <View>
          <Text>Crop Details</Text>
          <Text>Previous crop type</Text>
          <DropDown
            selectedValue={FieldStore.field.prevCropType}
            onChange={item => (FieldStore.field.prevCropType = item)}
            values={this.crops}
          />
          <Text>Have you grown grass in the last 3 years</Text>
          <DropDown
            selectedValue={FieldStore.field.recentGrass}
            onChange={item => (FieldStore.field.recentGrass = item)}
            values={this.yesno}
          />
          <Text>Crop type</Text>
          <DropDown
            selectedValue={FieldStore.field.cropType}
            onChange={item => (FieldStore.field.cropType = item)}
            values={this.cropType}
          />
          <Text>Crop Nutrient requirements</Text>
          <Text>Calculations go here</Text>
        </View>
        <View>
          <Text>Graph</Text>
        </View>
        <Button onPress={this.saveField} title="Save" />
      </ScrollView>
    );
  }
  private saveField = () => {
    FieldStore.Save();
    this.props.navigation.navigate("Home");
  }

  private draw() {
    this.setState({
      showSave: true,
      mapMoveEnabled: false
    });
  }
  private save() {
    const { marker, area } = this.state;

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
    FieldStore.newField.coordinates.length = 0;
    this.setState({
      marker: undefined,
      mapMoveEnabled: true,
      showSave: false
    });
  }
  private reset() {
    FieldStore.newField.coordinates.length = 0;
    this.setState({
      marker: undefined,
      mapMoveEnabled: true
    });
  }

  private onPress(e: any) {
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
