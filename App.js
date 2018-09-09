/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Polygon } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const halfHeight = height / 2;

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={"google"}
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          toolbarEnabled={true}
          mapType={"satellite"}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 45,
            longitudeDelta: 45
          }}
        >
          <Polygon
            key={1}
            coordinates={[
              { latitude: 40, longitude: 2 },
              { latitude: 45, longitude: -5 },
              { latitude: 50, longitude: 4 }
            ]}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width,
    height: halfHeight
  }
});
