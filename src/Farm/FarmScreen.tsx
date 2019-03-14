import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Col,
  Container,
  Content,
  Footer,
  FooterTab,
  Form,
  Grid,
  H1,
  H2,
  H3,
  Header,
  Input,
  Row,
  Text
} from "native-base";
import React, { Component } from "react";
import { FlatList, ScrollView, StatusBar, View } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { NavigationScreenProp } from "react-navigation";

import DisplayPoundsPerArea from "../components/displayPoundsPerArea";
import DropDown from "../components/DropDown";

import Field from "../model/field";

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
              <View>
                <Text>Scroll around and find your Farm.</Text>
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
                  onPress={e => this.onPress(e)}
                >
                  {FarmStore.farm.farmLocation && (
                    <Marker coordinate={FarmStore.farm.farmLocation} />
                  )}
                </MapView>
                {!this.state.showSave && (
                  <Form>
                    <Button primary onPress={() => this.draw()}>
                      <Text>Place Pin on Farm</Text>
                    </Button>
                  </Form>
                )}
                {this.state.showSave && (
                  <View>
                    <Button info onPress={() => this.save()}>
                      <Text>Set Location</Text>
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
                <Input
                  selectTextOnFocus={true}
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  onChangeText={text => (FarmStore.farm.name = text)}
                >
                  {FarmStore.farm.name}
                </Input>

                <View>
                  <Text>Add Field</Text>
                  <Button
                    onPress={() => {
                      FarmStore.saveFarm().then(() => {
                        this.props.FieldStore.farm = FarmStore.farm;
                        this.props.navigation.navigate("Field", {
                          farmKey: FarmStore.farm.key
                        });
                      });
                    }}
                  >
                    <Text>Add Field</Text>
                  </Button>
                </View>
                <ScrollView>
                  <FlatList<Field>
                    data={FieldStore.fields.slice()}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                      <Button
                        onPress={() => {
                          FarmStore.saveFarm().then(() => {
                            this.props.FieldStore.farm = FarmStore.farm;
                            this.props.navigation.navigate("Field", {
                              fieldKey: item.key
                            });
                          });
                        }}
                      >
                        <Text>{item.name}</Text>
                      </Button>
                    )}
                  />
                </ScrollView>
                <Form>
                  <Text>Set Farm Rainfall</Text>
                  <DropDown
                    selectedValue={FarmStore.farm.rainfall}
                    onChange={item => FarmStore.SelectRainfall(item)}
                    values={this.RainfallTypes}
                  />
                  <Grid>
                    <Row>
                      <Text
                        style={{
                          alignSelf: "center",
                          alignItems: "center"
                        }}
                      >
                        How much do you pay for your fertiliser? This is used to
                        calculate your cost savings.
                      </Text>
                    </Row>
                    <Row>
                      <Col>
                        <Text>
                          N(
                          <DisplayPoundsPerArea />)
                        </Text>
                      </Col>
                      <Col>
                        <Input
                          keyboardType="numeric"
                          onChangeText={item => FarmStore.SetNCost(item)}
                          value={String(FarmStore.farm.costN)}
                          selectTextOnFocus={true}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Text>
                          P
                          <Text style={{ fontSize: 15, lineHeight: 37 }}>
                            2
                          </Text>
                          O
                          <Text style={{ fontSize: 15, lineHeight: 37 }}>
                            5
                          </Text>
                          (
                          <DisplayPoundsPerArea />)
                        </Text>
                      </Col>
                      <Col>
                        <Input
                          keyboardType="numeric"
                          onChangeText={item => FarmStore.SetPCost(item)}
                          value={String(FarmStore.farm.costP)}
                          selectTextOnFocus={true}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Text>
                          K
                          <Text style={{ fontSize: 15, lineHeight: 37 }}>
                            2
                          </Text>
                          O (<DisplayPoundsPerArea />)
                        </Text>
                      </Col>
                      <Col>
                        <Input
                          keyboardType="numeric"
                          onChangeText={item => FarmStore.SetKCost(item)}
                          value={String(FarmStore.farm.costK)}
                          selectTextOnFocus={true}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </Form>
              </View>
            </ScrollView>
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button rounded onPress={() => this.saveFarm()}>
              <Text>Save Farm</Text>
            </Button>
            <Button rounded onPress={() => this.cancelScreen()}>
              <Text>cancel</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
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

    FarmStore.farm.farmLocation = undefined;
    this.setState({ mapMoveEnabled: true, showSave: false });
  }

  private reset() {
    const { FarmStore } = this.props;

    FarmStore.farm.farmLocation = undefined;
    this.setState({ mapMoveEnabled: true });
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
