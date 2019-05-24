import { inject, observer } from "mobx-react/native";
import { Col, Footer, FooterTab, Form, Grid, Item, Row } from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  View,
  NativeModules
} from "react-native";
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

import Field from "../model/field";
import LatLng from "../model/LatLng";

import { Button, Input } from "react-native-elements";

import styles from "../styles/style";

import RNFS from "react-native-fs";
import Mailer from "react-native-mail";
import { database } from "../database/Database";

import { generateSecureRandom } from "react-native-securerandom";
const Aes = NativeModules.Aes;

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
                      S (<DisplayPoundsPerArea />)
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
                      Mg (<DisplayPoundsPerArea />)
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
                this.exportField(FarmStore.farm.key);
              }}
              title="Export Field."
            />
            <Text>{this.state.resultString2}</Text>
            <Text>{this.state.resultString}</Text>
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
  private async exportField(farmKey: string) {
    // get data from database and put it into the json format
    // encrypt the json
    // email the json
    const { CalculatorStore, SettingsStore, FarmStore } = this.props;

    database.exportFarm(farmKey).then(async farm => {
      const ivbytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let iv = String.fromCharCode.apply(null, ivbytes);
      const iv64 = this.Base64.btoa(iv);
      const saltbytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let salt64 = this.Base64.btoa(String.fromCharCode.apply(null, saltbytes));
      //  const salt = "foo";

      salt64 =
        "sQoaW1PC8w5NXfwhxLN4GTWvYEavgbW+Fc4q8m2sxdSdfv9GstLDd2ig5DuDNEW2MJXi45mgAJlMpkaEEFPt5oGUpsog8JqTIbWJX0kiqxubPUbtWV7Hco+J7OoxHUiRl6MNh+fFTh9M2+kr1a0NoLTQEU4vdGfgeHyhBsZ0Wkg=";

      iv = "W0kL6nz7J7HOVhWoZ1g1QQ==";

      const longkeyHex: string = await Aes.pbkdf2(
        "crapapp",
        salt64,
        10000,
        384
      );

      const confidentialityKey = longkeyHex.substring(0, 32);
      const integKeyHex = longkeyHex.substring(32, 96);

      const confidentialityKey64 = this.Base64.btoa(confidentialityKey);
      const integretykey64 = this.Base64.btoa(integKeyHex);

      const encrypted = await Aes.encrypt(
        JSON.stringify(farm),
        confidentialityKey,
        iv
      );

      const mac = await Aes.hmac256(iv64 + encrypted, integretykey64);
      const mac64 = this.Base64.btoa(mac);

      let outputString = `${salt64}:${iv}:${mac64}:${encrypted}`;

      this.setState({
        resultString: `Salt64:${salt64}\r\niv64:${iv64}\r\nintegkey64:${integretykey64}\r\nconfkey64:${confidentialityKey64}\r\mac:${mac}\r\npayload:${encrypted}

        \r\mac64:${mac64}}\r\npayload64:${encrypted}
         `
      });
      //   outputString =
      //   "sQoaW1PC8w5NXfwhxLN4GTWvYEavgbW+Fc4q8m2sxdSdfv9GstLDd2ig5DuDNEW2MJXi45mgAJlMpkaEEFPt5oGUpsog8JqTIbWJX0kiqxubPUbtWV7Hco+J7OoxHUiRl6MNh+fFTh9M2+kr1a0NoLTQEU4vdGfgeHyhBsZ0Wkg=:W0kL6nz7J7HOVhWoZ1g1QQ==:bh6WDTHqqS/nPW3fAaLA0dbel+I71sdfxZmnrookQeM=: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";

      let datajspn: string = await this.decrypt(outputString, "");
      this.setState({ resultString: datajspn });

      /*    const filePath = `${RNFS.LibraryDirectoryPath}/FarmsData.json.enc`;
      RNFS.writeFile(filePath, outputString).then(
        // get handle on file path.
        Mailer.mail(
          {
            subject: "Farm Export",
            recipients: [SettingsStore.appSettings.email],

            body: "Here is your farm export.",
            isHTML: false,
            attachment: {
              path: filePath, // The absolute path of the file from which to read data.
              type: "text", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
              name: "FarmsData.json.enc"
            }
          },
          (error, event) => {
            // this.setState({ resultString: event });
            // handle error
          }
        )
      ); */
    });
  }

  private async decrypt(text: string, password: string): Promise<string> {
    const stuff = text.split(":");

    //   const saltbytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //  const salt = String.fromCharCode.apply(null, saltbytes);
    const salt = stuff[0];
    const iv = stuff[1];
    const payload = stuff[3];

    const longkey = await Aes.pbkdf2("crapapp", salt, 10000, 384);

    const confidentialityKey = longkey.substring(0, 32);
    const integretykey = longkey.substring(32, 96);

    this.setState({
      resultString: `Salt:${salt}\r\niv:${iv}\r\nintegkey:${integretykey}\r\nconfegkey:${confidentialityKey}\r\nmac:${
        stuff[2]
      }\r\npayload:${payload}`
    });

    try {
      return await Aes.decrypt(payload, confidentialityKey, iv).then(d => {
        this.setState({
          resultString2: d
        });
        return d;
      });
    } catch (exc) {
      if (
        exc instanceof Error &&
        (exc.message.includes("BAD_DECRYPT") ||
          exc.message.includes("Decrypt failed"))
      ) {
        console.log("bad decrypt");
      }

      throw exc;
    }
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
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  Base64 = {
    btoa: (input: string = "") => {
      let str = input;
      let output = "";

      for (
        let block = 0, charCode, i = 0, map = this.chars;
        str.charAt(i | 0) || ((map = "="), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
      ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
          );
        }

        block = (block << 8) | charCode;
      }

      return output;
    },

    atob: (input: string = "") => {
      let str = input.replace(/=+$/, "");
      let output = "";

      if (str.length % 4 == 1) {
        throw new Error(
          "'atob' failed: The string to be decoded is not correctly encoded."
        );
      }
      for (
        let bc = 0, bs = 0, buffer, i = 0;
        (buffer = str.charAt(i++));
        ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
          : 0
      ) {
        buffer = this.chars.indexOf(buffer);
      }

      return output;
    }
  };
}
// https://github.com/mobxjs/mobx-react/issues/256#issuecomment-341419935
// https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
// https://mobx.js.org/best/pitfalls.html
//
