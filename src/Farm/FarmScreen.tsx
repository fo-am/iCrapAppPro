import { inject, observer } from "mobx-react/native";
import { Col, Footer, FooterTab, Form, Grid, Item, Row } from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import DisplayPoundsPerArea from "../components/displayPoundsPerArea";
import DropDown from "../components/DropDown";

import Field from "../model/field";
import LatLng from "../model/LatLng";

import { Button, Input } from "react-native-elements";
import styles from "../styles/style";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  FarmStore: FarmStore;
  CalculatorStore: CalculatorStore;
  // SettingsStore: SettingsStore;
}

interface State {
  area: any;
  mapMoveEnabled: boolean;
  showSave: boolean;
  showDraw: boolean;
  showHaveProps: boolean;
}

@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
@observer
export default class FarmScreen extends Component<Props, State> {
  public RainfallTypes = {
    "rain-high": "High (> 700mm)",
    "rain-medium": "Medium (600-700mm)",
    "rain-low": "Low (< 600mm)"
  };
  private prevRegion: Region | undefined = undefined;
  constructor(props: Props) {
    super(props);
    const { CalculatorStore, FarmStore } = this.props;
    this.state = {
      area: undefined,
      mapMoveEnabled: true,
      showSave: false,
      showDraw: true,
      showHaveProps: false
    };
    CalculatorStore.rainfall = FarmStore.farm.rainfall;
  }

  public componentWillMount() {
    const { navigation, FarmStore, FieldStore } = this.props;
    const item = navigation.getParam("farmKey", undefined);
    if (item) {
      FarmStore.SetFarm(item);
      FieldStore.getFields(item);
    } else {
      FarmStore.reset();
    }
  }
  public render() {
    const { FarmStore, FieldStore } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        {/*

       // Add farm
       // Add farm things (rainfall, nutrient costs, name, id)
       // farm location on map (find by postcode etc!)
       // if fields exist show them
       // list of fields + add field button


        */}
        <MapView
          moveOnMarkerPress={false}
          style={styles.map}
          scrollEnabled={this.state.mapMoveEnabled}
          provider={PROVIDER_GOOGLE}
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          toolbarEnabled={true}
          mapType={"satellite"}
          initialRegion={FarmStore.UpdateLocation()}
          region={this.setLocation()}
          onPress={e => this.onPress(e)}
          onRegionChangeComplete={reg => (this.prevRegion = reg)}
        >
          {FarmStore.farm.farmLocation && (
            <Marker coordinate={FarmStore.farm.farmLocation} />
          )}
        </MapView>
        <View
          style={{
            width: "50%",
            position: "absolute", // use absolute position to show button on top of the map
            top: "2%", // for center align
            alignSelf: "flex-end", // for align to right
            zIndex: 1
          }}
        >
          {!this.state.showSave && (
            <Form>
              <Button
                buttonStyle={[styles.roundButton, { margin: 0 }]}
                titleStyle={styles.buttonText}
                onPress={() => this.draw()}
                title="Place Pin on Farm"
              />
            </Form>
          )}
          {this.state.showSave && (
            <View>
              <Button
                buttonStyle={[styles.roundButton, styles.bgColourBlue]}
                titleStyle={styles.buttonText}
                onPress={() => this.save()}
                title="Save Location"
              />
              <Button
                buttonStyle={[styles.roundButton, styles.bgColourRed]}
                titleStyle={styles.buttonText}
                onPress={() => this.cancel()}
                title="Cancel"
              />
            </View>
          )}
        </View>
        <View
          style={{
            width: "50%",
            position: "absolute",
            top: "2%",
            alignSelf: "flex-start",
            zIndex: 2
          }}
        >
          <GooglePlacesAutocomplete
            listViewDisplayed="true"
            placeholder="Search"
            minLength={3} // minimum length of text to search
            autoFocus={false}
            fetchDetails={true}
            onPress={(data, details = undefined) => {
              // 'details' is provided when fetchDetails = true
              // do a thing
              if (details != undefined) {
                const loc: LatLng = new LatLng();
                loc.latitude = details.geometry.location.lat;
                loc.longitude = details.geometry.location.lng;
                FarmStore.farm.farmLocation = loc;

                this.draw();
              }
            }}
            getDefaultValue={() => {
              return ""; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: "AIzaSyAVTbzKLIbNe23Ieh1AXxktDHPiC3ze3O4",
              types: "geocode" // default: 'geocode'
            }}
            styles={{
              container: { backgroundColor: "white" },
              description: {
                textAlign: "left"
              },
              // textInputContainer: { width: "100%" },
              listView: { width: "200%", backgroundColor: "white" },
              predefinedPlacesDescription: {
                color: "#1faadb"
              }
            }}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              region: "GB"
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance"
            }}
            filterReverseGeocodingByTypes={[]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            predefinedPlacesAlwaysVisible={true}
          />
        </View>
        <ScrollView>
          <View style={styles.narrow}>
            <Text style={styles.H2}>Farm Name</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
              onChangeText={text => (FarmStore.farm.name = text)}
            >
              {FarmStore.farm.name}
            </Input>
            <View>
              <Text style={styles.H2}>Add Field</Text>
              <Button
                buttonStyle={styles.roundButton}
                titleStyle={styles.buttonText}
                onPress={() => {
                  FarmStore.saveFarm().then(() => {
                    this.props.FieldStore.farm = FarmStore.farm;
                    this.props.navigation.navigate("Field", {
                      farmKey: FarmStore.farm.key
                    });
                  });
                }}
                title="Add Field"
              />
            </View>
            <View
              style={{ flex: 1, height: Dimensions.get("window").height * 0.5 }}
            >
              <FlatList<Field>
                data={FieldStore.fields.slice()}
                keyExtractor={item => item.key}
                renderItem={({ item }) => (
                  <Button
                    titleStyle={styles.buttonText}
                    buttonStyle={[
                      styles.roundButton,
                      styles.bgColourBlue,
                      { marginLeft: "5%", marginRight: "5%" }
                    ]}
                    onPress={() => {
                      FarmStore.saveFarm().then(() => {
                        this.props.FieldStore.farm = FarmStore.farm;
                        this.props.navigation.navigate("Field", {
                          fieldKey: item.key
                        });
                      });
                    }}
                    title={item.name}
                  />
                )}
              />
            </View>
            <Text style={styles.H2}>Set Farm Rainfall</Text>
            <DropDown
              style={styles.outline}
              selectedValue={FarmStore.farm.rainfall}
              onChange={item => FarmStore.SelectRainfall(item)}
              values={this.RainfallTypes}
            />
            <View style={{ margin: 20, backgroundColor: "#d6d6d6" }}>
              <Grid style={{ alignItems: "center" }}>
                <Row>
                  <Col>
                    <Text style={styles.H3}>
                      How much do you pay for your fertiliser?
                    </Text>
                    <Text style={styles.H3}>
                      This is used to calculate your cost savings.
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text>
                      N (
                      <DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetNCost(item)}
                      value={String(FarmStore.farm.costN)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text>
                      P<Text style={{ fontSize: 15, lineHeight: 37 }}>2</Text>O
                      <Text style={{ fontSize: 15, lineHeight: 37 }}>5</Text>
                      (
                      <DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetPCost(item)}
                      value={String(FarmStore.farm.costP)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text>
                      K<Text style={{ fontSize: 15, lineHeight: 37 }}>2</Text>
                      O (<DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetKCost(item)}
                      value={String(FarmStore.farm.costK)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text>
                      S (<DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetSCost(item)}
                      value={String(FarmStore.farm.costS)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text>
                      Mg (<DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetMgCost(item)}
                      value={String(FarmStore.farm.costMg)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
              </Grid>
            </View>
          </View>
          <Footer>
            <FooterTab>
              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.saveFarm()}
                title="Save Farm"
              />
              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.cancelScreen()}
                title="Cancel"
              />
            </FooterTab>
          </Footer>
        </ScrollView>
      </SafeAreaView>
    );
  }
  private setLocation(): Region | undefined {
    const { FarmStore } = this.props;
    if (this.state.mapMoveEnabled) {
      this.prevRegion = FarmStore.UpdateLocation();
      return this.prevRegion;
    } else {
      return this.prevRegion;
    }
  }
  private saveFarm() {
    const { FarmStore } = this.props;
    FarmStore.saveFarm();
    this.props.FieldStore.farm = FarmStore.farm;
    this.props.navigation.navigate("Home");
  }
  private cancelScreen() {
    this.props.navigation.navigate("Home");
  }

  private draw() {
    this.setState({
      showSave: true,
      mapMoveEnabled: false
    });
  }
  private save() {
    this.setState({
      showSave: false,
      mapMoveEnabled: true
    });
  }
  private cancel() {
    const { FarmStore } = this.props;

    //   FarmStore.farm.farmLocation = undefined;
    this.setState({ mapMoveEnabled: true, showSave: false });
  }

  private onPress(e: any) {
    const { FarmStore } = this.props;
    if (this.state.showSave) {
      FarmStore.farm.farmLocation = e.nativeEvent.coordinate;
      this.setState({
        mapMoveEnabled: false
      });
    }
  }
}
// https://github.com/mobxjs/mobx-react/issues/256#issuecomment-341419935
// https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
// https://mobx.js.org/best/pitfalls.html
//
