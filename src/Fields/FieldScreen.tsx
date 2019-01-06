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

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 50.184363;
const LONGITUDE = -5.173699;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

interface Props {
  FieldStore: FieldStore;
  field: Field;
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  polygons: Array<Polygon>;
  marker: any;
  editing: any;
  area: any;
  region: Region;
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
      area: undefined,
      mapMoveEnabled: true,
      showSave: false,
      showDraw: true,
      showHaveProps: false
    };

    if (this.props.field == undefined) {
      this.state.showHaveProps = true;
    }
  }
  public componentWillMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("field", undefined);
    if (item) {
      this.props.FieldStore.field = item;
    }
  }
  public render() {
    const { FieldStore } = this.props;
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

        {this.state.showHaveProps ? (
          <View>
            <Text>no field given to us</Text>
          </View>
        ) : (
          <View>
            <Text>We have field!</Text>
          </View>
        )}

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
          initialRegion={this.state.region}
          onPress={e => this.onPress(e)}
        >
          {this.props.FieldStore.field.fieldCoordinates && (
            <Polygon
              geodesic={true}
              key={this.props.FieldStore.field.fieldCoordinates.id}
              coordinates={this.props.FieldStore.getCoords()}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
              tappable={false}
            />
          )}
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
        <TextInput style={{ fontSize: 20, fontWeight: "bold" }}>
          {this.props.FieldStore.field.name}
        </TextInput>
        <Text>Field Size</Text>
        <TextInput style={{ fontSize: 20, fontWeight: "bold" }}>
          {this.props.FieldStore.field.area}
        </TextInput>
        <View>
          <Text>Add Spread</Text>
        </View>
        <View>
          <Text>Soil Details</Text>
          <Text>Soil Type</Text>
        </View>
        <View>
          <Text>Crop Details</Text>
        </View>
        <View>
          <Text>Graph</Text>
        </View>
        <Button onPress={this.saveField} title="Save" />
      </ScrollView>
    );
  }
  private saveField = () => {
    this.props.FieldStore.Save();
    this.props.navigation.navigate("Home");
  };

  private draw() {
    this.setState({
      showSave: true,
      mapMoveEnabled: false
    });
  }
  private save() {
    const { polygons, editing, marker, area } = this.state;

    const size = new SphericalUtil({}).ComputeSignedArea(editing.coordinates);

    this.props.FieldStore.SetFieldArea(size);
    this.props.FieldStore.SetCoordinates(editing);

    this.setState({
      //  polygons: [editing],
      editing: undefined,
      marker: undefined,
      showSave: false,
      mapMoveEnabled: true
    });
    // save to file
  }
  private cancel() {
    this.setState({
      editing: undefined,
      marker: undefined,
      mapMoveEnabled: true,
      showSave: false
    });
  }
  private reset() {
    this.setState({
      polygons: [],
      editing: undefined,
      marker: undefined,
      mapMoveEnabled: true
    });
  }

  private onPress(e: any) {
    if (this.state.showSave) {
      const { editing, marker } = this.state;
      this.setState({
        marker: {
          coordinate: e.nativeEvent.coordinate,
          key: id++
        },
        mapMoveEnabled: false
      });
      if (!editing) {
        this.setState({
          editing: {
            id: id++,
            coordinates: [e.nativeEvent.coordinate]
          },
          mapMoveEnabled: false
        });
      } else {
        this.setState({
          editing: {
            ...editing,
            coordinates: [...editing.coordinates, e.nativeEvent.coordinate]
          },
          mapMoveEnabled: false
        });
      }
    }
  }
}
// https://github.com/mobxjs/mobx-react/issues/256#issuecomment-341419935
// https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
// https://mobx.js.org/best/pitfalls.html
//
