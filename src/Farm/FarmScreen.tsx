import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  Form,
  H1,
  H2,
  H3,
  Header,
  Left,
  Right,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
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
import FarmStore from "../store/FarmStore";
import FieldStore from "../store/FieldsStore";
// import SettingsStore from "../store/settingsStore";
import styles from "../styles/style";

import Strings from "../assets/strings";
import { database } from "../database/Database.js";

let id = 0;

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
  FarmStore: FarmStore;
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

@inject("FieldStore", "CalculatorStore", "SettingsStore", "FarmStore")
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
    const { FarmStore } = this.props;
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
                  initialRegion={FarmStore.UpdateLocation()}
                  onPress={e => this.onPress(e)}
                >
                  {this.state.marker && (
                    <Marker coordinate={this.state.marker.coordinate} />
                  )}
                </MapView>
                {!this.state.showSave && (
                  <Form>
                    <Button primary onPress={() => this.draw()}>
                      <Text>Draw it</Text>
                    </Button>
                  </Form>
                )}
                {this.state.showSave && (
                  <View style={styles.container}>
                    <Button info onPress={() => this.save()}>
                      <Text>Save</Text>
                    </Button>
                    <Button warning onPress={() => this.cancel()}>
                      <Text>Cancel</Text>
                    </Button>
                    <Button info onPress={() => this.reset()}>
                      <Text>Reset</Text>
                    </Button>
                  </View>
                )}
                <Text>Farm Name</Text>
                <TextInput
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  onChangeText={text => (FarmStore.farm.name = text)}
                >
                  {FarmStore.farm.name}
                </TextInput>

                <View style={styles.container}>
                  <Text>Add Field</Text>
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate("Field", {
                        farmKey: FarmStore.farm.key
                      })
                    }
                  >
                    <Text>Add Field</Text>
                  </Button>
                </View>

                <Button onPress={() => this.saveFarm()}>
                  <Text>Save Farm</Text>
                </Button>
              </View>
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }
  private saveFarm() {
    FarmStore.saveFarm();
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
    const { FarmStore } = this.props;
    FarmStore.farm.farmLocation = this.state.marker.coordinate;

    this.setState({
      showSave: false,
      mapMoveEnabled: true
    });
    // save to file
  }
  private cancel() {
    const { FarmStore } = this.props;

    this.setState({
      marker: undefined,
      mapMoveEnabled: true,
      showSave: false
    });
  }
  private reset() {
    const { FarmStore } = this.props;

    this.setState({
      marker: undefined,
      mapMoveEnabled: true
    });
  }

  private onPress(e: any) {
    const { FarmStore } = this.props;
    if (this.state.showSave) {
      this.setState({
        marker: {
          coordinate: e.nativeEvent.coordinate,
          key: id++
        },
        mapMoveEnabled: false
      });
    }
  }
}
// https://github.com/mobxjs/mobx-react/issues/256#issuecomment-341419935
// https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
// https://mobx.js.org/best/pitfalls.html
//
