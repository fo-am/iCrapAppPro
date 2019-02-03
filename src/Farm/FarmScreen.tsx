import { inject, observer } from "mobx-react/native";
import { Container, Content, Form } from "native-base";
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
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { NavigationScreenProp } from "react-navigation";

import dropDownData from "../assets/dropDownData.json";
import DropDown from "../components/DropDown";
import SphericalUtil from "../geoUtils";
import Field from "../model/field";
import CalculatorStore from "../store/calculatorStore";
import FieldStore from "../store/FieldsStore";
// import SettingsStore from "../store/settingsStore";
import styles from "../styles/style";

import Strings from "../assets/strings";

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
export default class FarmScreen extends Component<Props, State> {
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

  public render() {
    const { FieldStore } = this.props;
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView>
              <StatusBar />
              {/*

       // Add farm
       // Add farm things (rainfall, nutrient costs, name, id)
       // farm location on map (find by postcode etc!)
       // if fields exist show them
       // list of fields + add field button


        */}
              <View style={styles.container}>
                <Text>Scroll around and find your Farm.</Text>
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
                  {this.state.marker && (
                    <Marker coordinate={this.state.marker.coordinate} />
                  )}
                </MapView>
                {!this.state.showSave && (
                  <View style={styles.container}>
                    <TouchableOpacity
                      onPress={() => this.draw()}
                      style={[styles.bubble, styles.button]}
                    >
                      <Text>Draw</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {this.state.showSave && (
                  <View style={styles.container}>
                    <TouchableOpacity
                      onPress={() => this.save()}
                      style={[styles.bubble, styles.button]}
                    >
                      <Text>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.cancel()}
                      style={[styles.bubble, styles.button]}
                    >
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.reset()}
                      style={[styles.bubble, styles.button]}
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
                <View style={styles.container}>
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
                <View style={styles.container}>
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
                  <TextInput>Here goes the soil N supply calculation</TextInput>
                </View>
                <View style={styles.container}>
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
                  <Text>
                    Nitrogen requirements
                    {FieldStore.cropRequirementsResult.nitrogenRequirement}
                  </Text>
                  <Text>
                    phosphorousRequirement requirements
                    {FieldStore.cropRequirementsResult.phosphorousRequirement}
                  </Text>
                  <Text>
                    potassiumRequirement requirements
                    {FieldStore.cropRequirementsResult.potassiumRequirement}
                  </Text>
                  <Text>
                    nitrogenSupply
                    {FieldStore.cropRequirementsResult.nitrogenSupply}
                    This needs turned into the value obviously!
                  </Text>
                </View>
                <View style={styles.container}>
                  <Text>Graph</Text>
                </View>
                <Button onPress={this.saveField} title="Save" />
              </View>
            </ScrollView>
          </Form>
        </Content>
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
