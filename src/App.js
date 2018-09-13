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
import MapView, { Polygon, Marker } from "react-native-maps";
import Styles from "./styles/style";
import SphericalUtil from "./geoUtils";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 50.184363;
const LONGITUDE = -5.173699;
const LATITUDE_DELTA = 0.005;
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
      marker: null,
      editing: null,
      area: null
    };
  }
  finish() {
    const { polygons, editing, marker, area } = this.state;

    var size = new SphericalUtil().ComputeSignedArea(editing.coordinates);

    this.setState({
      polygons: [...polygons, editing],
      editing: null,
      marker: null,
      area: size
    });
  }
  cancel() {
    this.setState({
      editing: null,
      marker: null
    });
  }
  reset() {
    this.setState({
      polygons: [],
      editing: null,
      marker: null
    });
  }
  onPress(e) {
    const { editing, marker } = this.state;
    this.setState({
      marker: { coordinate: e.nativeEvent.coordinate, key: id++ }
    });
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
    return (
      <View style={Styles.container}>
        <StatusBar />
        <Text>Top</Text>
        <MapView
          style={Styles.map}
          scrollEnabled={this.state.editing == null}
          provider={"google"}
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          toolbarEnabled={true}
          mapType={"satellite"}
          initialRegion={this.state.region}
          onPress={e => this.onPress(e)}
        >
          {this.state.polygons.map(polygon => (
            <Polygon
              geodesic={true}
              key={polygon.id}
              coordinates={polygon.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
              tappable={false}
            />
          ))}
          {this.state.editing && (
            <Polygon
              geodesic={true}
              key={this.state.editing.id}
              coordinates={this.state.editing.coordinates}
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
        <TouchableOpacity
          onPress={() => this.finish()}
          style={[Styles.bubble, Styles.button]}
        >
          <Text>Finish</Text>
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
        <Text>{this.state.area}</Text>
      </View>
    );
  }
}
