import React, { Component } from "react";
import {
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

import SphericalUtil from "./geoUtils";
import Styles from "./styles/style";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 50.184363;
const LONGITUDE = -5.173699;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

interface Props {}

interface State {
  polygons: any;
  marker: any;
  editing: any;
  area: any;
  region: any;
}

export default class MapScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polygons: [],
      marker: undefined,
      editing: undefined,
      area: undefined
    };
  }
  public render() {
    return (
      <View style={Styles.container}>
        <StatusBar />
        <Text>Top</Text>
        <MapView
          style={Styles.map}
          scrollEnabled={this.state.editing == undefined}
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
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {this.state.area}
        </Text>
      </View>
    );
  }

  private finish() {
    const { polygons, editing, marker, area } = this.state;

    const size = new SphericalUtil({}).ComputeSignedArea(editing.coordinates);

    this.setState({
      polygons: [...polygons, editing],
      editing: undefined,
      marker: undefined,
      area: size
    });
  }
  private cancel() {
    this.setState({
      editing: undefined,
      marker: undefined
    });
  }
  private reset() {
    this.setState({
      polygons: [],
      editing: undefined,
      marker: undefined
    });
  }

  private onPress(e: any) {
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
}
