/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity
} from "react-native";
import MapView, { Polygon } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const halfHeight = height / 2;

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = 0.0;
const LATITUDE_DELTA = 50;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polygons: [],
      editing: null
    };
  }
  finish() {
    const { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null
    });
  }
  onPress(e) {
    const { editing } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate]
        }
      });
    } else {
      this.setState({
        editing: {
          ...editing,
          coordinates: [...editing.coordinates, e.nativeEvent.coordinate]
        }
      });
    }
  }

  render() {
    const mapOptions = {
      scrollEnabled: true
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    }
    return (
      <View style={styles.container}>
        <StatusBar />
        <Text>Top</Text>
        <MapView
          style={styles.map}
          provider={"google"}
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          toolbarEnabled={true}
          mapType={"satellite"}
          initialRegion={this.state.region}
          onPress={e => this.onPress(e)}
        >
          {this.state.polygons.map(polygon => (
            <Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          ))}
          {this.state.editing && (
            <Polygon
              key={this.state.editing.id}
              coordinates={this.state.editing.coordinates}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
        </MapView>
        <TouchableOpacity
          onPress={() => this.finish()}
          style={[styles.bubble, styles.button]}
        >
          <Text>Finish + {id}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333"
  },
  map: {
    width,
    height: halfHeight
  },
  topBar: {
    height: Platform.OS === "ios" ? 20 : StatusBar.currentHeight
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  }
});
