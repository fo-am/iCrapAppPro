import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  CardItem,
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
  Item,
  Label,
  Left,
  Right,
  Row,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import { FlatList, ScrollView, StatusBar, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import { database } from "./database/Database";
import Farm from "./model/Farm";
import Manure from "./model/manure";
import FarmStore from "./store/FarmStore";
import ManureStore from "./store/manureStore";
import styles from "./styles/style";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
  ManureStore: ManureStore;
  FarmStore: FarmStore;
}

interface MyComponentState {}

@inject("ManureStore", "FarmStore")
@observer
export default class HomeScreen extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Container>
          <Content>
            <Form>
              <StatusBar />
              <View style={styles.container}>
                <Text>Add a farm</Text>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate("Farm", {
                      farmKey: undefined
                    })
                  }
                >
                  <Text>Add a Farm</Text>
                </Button>
                <ScrollView>
                  <FlatList<Farm>
                    data={this.props.FarmStore.farms.slice()}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                      <Button
                        onPress={() => {
                          this.props.navigation.navigate("Farm", {
                            farmKey: item.key
                          });
                        }}
                      >
                        <Text>{item.name}</Text>
                      </Button>
                    )}
                  />
                </ScrollView>

                <Text>Settings</Text>
                <Button
                  onPress={() => this.props.navigation.navigate("Settings")}
                >
                  <Text>Settings</Text>
                </Button>

                <Button
                  onPress={() => this.props.navigation.navigate("Calculator")}
                >
                  <Text>Calculator</Text>
                </Button>

                <Text>Manure</Text>
                <Button
                  onPress={() => this.props.navigation.navigate("CustomManure")}
                >
                  <Text>Add a new manure</Text>
                </Button>
                <ScrollView>
                  <FlatList<Manure>
                    data={this.props.ManureStore.manures.slice()}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                      <Button
                        onPress={() => {
                          this.props.navigation.navigate("CustomManure", {
                            manure: item
                          });
                        }}
                      >
                        <Text>{item.name}</Text>
                      </Button>
                    )}
                  />
                </ScrollView>
                <Button
                  onPress={() => this.props.navigation.navigate("Export")}
                >
                  <Text>Export Data</Text>
                </Button>
                <Button onPress={() => this.clearStore()}>
                  <Text>clear store</Text>
                </Button>
              </View>
            </Form>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
  private clearStore = () => {
    database.delete().then(() => database.getAppSettings());
    this.props.FarmStore.farms = new Array<Farm>();
    this.props.ManureStore.manures = new Array<Manure>();
  };
}
