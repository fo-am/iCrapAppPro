import { inject, observer } from "mobx-react";
import moment, { Moment } from "moment";
import { Col, Footer, FooterTab, Grid, Row } from "native-base";
import React, { Component } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import { Button, Input } from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, {
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
  Region
} from "react-native-maps";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import DisplayPoundsPerArea from "../components/displayPoundsPerArea";
import DropDown from "../components/DropDown";
import ImportFileCheck from "../Export/ImportFileCheck";
import Field from "../model/field";
import LatLng from "../model/LatLng";
import styles from "../styles/style";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  FarmStore: FarmStore;
  CalculatorStore: CalculatorStore;
  SettingsStore: SettingsStore;
}

interface State {
  area: any;
  showSave: boolean;
  showDraw: boolean;
  showHaveProps: boolean;
  resultString: string;
  resultString2: string;
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
  private mapRef: MapView | null;

  constructor(props: Props) {
    super(props);
    const { CalculatorStore, FarmStore } = this.props;
    this.state = {
      area: undefined,
      showSave: false,
      showDraw: true,
      showHaveProps: false
    };
    CalculatorStore.rainfall = FarmStore.farm.rainfall;

    this.CheckBackup();
  }
  public componentWillMount() {
    const { navigation, FarmStore, FieldStore } = this.props;
    const farmKey = navigation.getParam("farmKey", undefined);
    if (farmKey) {
      FarmStore.SetFarm(farmKey);
      FieldStore.getFields(farmKey);
    } else {
      FarmStore.reset();
      FieldStore.reset();
    }
  }
  public render() {
    const { FarmStore, FieldStore } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImportFileCheck navigation={this.props.navigation} />
        <ScrollView scrollEnabled={!this.state.showSave}>
          <StatusBar barStyle="dark-content" />
          {/*

       // Add farm
       // Add farm things (rainfall, nutrient costs, name, id)
       // farm location on map (find by postcode etc!)
       // if fields exist show them
       // list of fields + add field button


        */}
          <MapView
            ref={ref => (this.mapRef = ref)}
            moveOnMarkerPress={false}
            style={[styles.map, this.fullSizeMap()]}
            provider={PROVIDER_GOOGLE}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
            toolbarEnabled={true}
            mapType={"satellite"}
            initialRegion={FarmStore.UpdateLocation()}
            region={this.setLocation()}
            onPress={e => this.mapPress(e)}
            onRegionChangeComplete={reg => (this.prevRegion = reg)}
          >
            {FieldStore.fields.map((field: Field) =>
              this.DrawFieldBoundry(field)
            )}

            {FarmStore.farm.farmLocation && (
              <Marker coordinate={FarmStore.farm.farmLocation} />
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
                buttonStyle={[styles.roundButton, { margin: 0 }]}
                titleStyle={styles.buttonText}
                onPress={() => this.enablePinPlacement()}
                title="Place Pin on Farm"
              />
            )}
            {this.state.showSave && (
              <View>
                <Button
                  buttonStyle={[styles.roundButton, styles.bgColourBlue]}
                  titleStyle={styles.buttonText}
                  onPress={() => this.savePinPlacement()}
                  title="Save Location"
                />
                <Button
                  buttonStyle={[styles.roundButton, styles.bgColourRed]}
                  titleStyle={styles.buttonText}
                  onPress={() => this.cancelPinPlacement()}
                  title="Cancel"
                />
              </View>
            )}
          </View>
          <View
            style={{
              width: "50%",
              position: "absolute",

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

                  this.enablePinPlacement();
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
          <View style={styles.narrow}>
            <Text style={styles.H2}>Farm Name</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
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
                    this.setFarmLocation();
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

            <Text style={[styles.H2, { textAlign: "center" }]}>
              Set Farm Rainfall
            </Text>
            <DropDown
              style={styles.outline}
              selectedValue={FarmStore.farm.rainfall}
              onChange={item => FarmStore.SelectRainfall(item)}
              values={this.RainfallTypes}
            />
            <View style={styles.narrow}>
              <Grid style={{ alignItems: "center" }}>
                <Row>
                  <Col>
                    <Text style={styles.H3}>
                      How much do you pay for your fertiliser?
                    </Text>
                    <Text style={styles.text}>
                      This is used to calculate your cost savings.
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={styles.text}>
                      N (
                      <DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputStyle={styles.TextInput}
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetNCost(item)}
                      value={String(FarmStore.farm.costN)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={styles.text}>
                      P<Text style={styles.sub}>2</Text>O
                      <Text style={styles.sub}>5</Text> (
                      <DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputStyle={styles.TextInput}
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetPCost(item)}
                      value={String(FarmStore.farm.costP)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={styles.text}>
                      K<Text style={styles.sub}>2</Text>
                      O (<DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputStyle={styles.TextInput}
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetKCost(item)}
                      value={String(FarmStore.farm.costK)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={styles.text}>
                      SO<Text style={styles.sub}>3</Text> (
                      <DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputStyle={styles.TextInput}
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetSCost(item)}
                      value={String(FarmStore.farm.costS)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={styles.text}>
                      MgO (<DisplayPoundsPerArea />)
                    </Text>
                  </Col>
                  <Col>
                    <Input
                      keyboardType="numeric"
                      inputStyle={styles.TextInput}
                      inputContainerStyle={styles.outline}
                      onChangeText={item => FarmStore.SetMgCost(item)}
                      value={String(FarmStore.farm.costMg)}
                      selectTextOnFocus={true}
                    />
                  </Col>
                </Row>
              </Grid>
            </View>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => {
                this.props.navigation.navigate("Export", {
                  farmKey: FarmStore.farm.key
                });
                //    this.exportField(FarmStore.farm.key);
              }}
              title="Export Farm"
            />
            <Text>{this.state.resultString2}</Text>
            <Text>{this.state.resultString}</Text>
          </View>
        </ScrollView>
        {!this.state.showSave && (
          <Footer>
            <FooterTab>
              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.saveFarm()}
                title="Save"
              />
              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.deleteFarm()}
                title="Delete"
              />
              <Button
                buttonStyle={styles.footerButton}
                titleStyle={styles.buttonText}
                onPress={() => this.cancelScreen()}
                title="Cancel"
              />
            </FooterTab>
          </Footer>
        )}
      </SafeAreaView>
    );
  }
  private CheckBackup() {
    const { FarmStore, SettingsStore } = this.props;
    const schedule = SettingsStore.appSettings.backupSchedule;
    if (schedule === "never") {
      return;
    }
    // get last backup time

    const targetTime: Moment = FarmStore.farm.lastBackup.clone();

    if (schedule === "daily") {
      targetTime.add(1, "day");
    }
    if (schedule === "weekly") {
      targetTime.add(1, "weeks");
    }
    if (schedule === "monthly") {
      targetTime.add(1, "months");
    }
    if (FarmStore.farm.lastBackup === undefined) {
      // No current backup, but a schedule so do a backup
      this.doBackup();
    }
    if (moment().isAfter(targetTime)) {
      // current time is bigger than target time so do a backup
      this.doBackup();
    }
  }
  private doBackup() {
    const { FarmStore } = this.props;
    Alert.alert(
      "Backup this farm now?",
      `This farm is due to be backed up according to your back up schedule setting.\r\nIt was last backed up on ${FarmStore.farm.lastBackup.format(
        "dddd, MMMM Do YYYY"
      )}`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: async () => {
            FarmStore.SetBackupTime();
          }
        },
        {
          text: "OK",
          onPress: async () => {
            FarmStore.SetBackupTime().then(() => {
              this.props.navigation.navigate("Export", {
                farmKey: FarmStore.farm.key
              });
            });
          }
        }
      ]
    );
  }

  private DrawFieldBoundry(field: Field) {
    if (field.fieldCoordinates.coordinates.slice().length > 0) {
      return (
        <View key={field.key}>
          <Polygon
            geodesic={true}
            tappable={false}
            coordinates={field.fieldCoordinates.coordinates.slice()}
            strokeColor="rgba(8,190,45,1)"
            fillColor="rgba(8,190,45,0.5)"
            strokeWidth={1}
          />
          <Marker coordinate={field.centre()}>
            <Text style={[styles.text, { color: "white" }]}>{field.name}</Text>
          </Marker>
        </View>
      );
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
  private setLocation(): Region | undefined {
    const { FarmStore } = this.props;
    if (!this.state.showSave) {
      this.prevRegion = FarmStore.UpdateLocation();
      return this.prevRegion;
    } else {
      return this.prevRegion;
    }
  }

  private deleteFarm(): void {
    const { FarmStore } = this.props;
    Alert.alert(
      "Delete This Farm?",
      `Are you sure you want to delete this farm?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {}
        },
        {
          text: "OK",
          onPress: () => {
            FarmStore.deleteFarm().then(() => this.props.navigation.pop());
          }
        }
      ]
    );
  }

  private saveFarm() {
    const { FarmStore } = this.props;

    this.setFarmLocation();

    FarmStore.saveFarm();
    this.props.FieldStore.farm = FarmStore.farm;
    this.props.navigation.navigate("Home");
  }
  private setFarmLocation() {
    const { FarmStore } = this.props;
    if (FarmStore.farm.farmLocation.latitude === 0) {
      this.mapRef.getMapBoundaries().then(loc => {
        const center = new LatLng();
        center.latitude = (loc.northEast.latitude + loc.southWest.latitude) / 2;
        center.longitude =
          (loc.northEast.longitude + loc.southWest.longitude) / 2;
        FarmStore.farm.farmLocation = center;
      });
    }
  }

  private cancelScreen() {
    this.props.navigation.navigate("Home");
  }

  private enablePinPlacement() {
    this.setState({
      showSave: true
    });
  }

  private savePinPlacement() {
    const { FarmStore } = this.props;
    if (FarmStore.farm.farmLocation.latitude === 0) {
      this.mapRef.getMapBoundaries().then(loc => {
        const center = new LatLng();
        center.latitude = (loc.northEast.latitude + loc.southWest.latitude) / 2;
        center.longitude =
          (loc.northEast.longitude + loc.southWest.longitude) / 2;
        FarmStore.farm.farmLocation = center;
      });
    }
    this.setState({
      showSave: false
    });
  }

  private cancelPinPlacement() {
    const { FarmStore } = this.props;

    //   FarmStore.farm.farmLocation = undefined;
    this.setState({ showSave: false });
  }

  private mapPress(e: any) {
    const { FarmStore } = this.props;
    if (this.state.showSave) {
      FarmStore.farm.farmLocation = e.nativeEvent.coordinate;
      this.setState({});
    }
  }
}
