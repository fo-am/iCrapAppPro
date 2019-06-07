import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import { database } from "./database/Database";
import Farm from "./model/Farm";
import Manure from "./model/manure";
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

    const listenToNavChange = this.props.navigation.addListener(
      "didFocus",
      () => {
        if (this.props.FarmStore.refresh === 1) {
          this.props.FarmStore.getFarms();
          this.props.FarmStore.refresh = 0;
        }
      }
    );
  }

  public render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <ScrollView>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.text}>Add a farm</Text>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() =>
                this.props.navigation.navigate("Farm", {
                  farmKey: undefined
                })
              }
              title="Add a Farm"
            />
            <View
              style={{ flex: 1, height: Dimensions.get("window").height * 0.5 }}
            >
              <FlatList<Farm>
                style={{ flex: 1 }}
                data={this.props.FarmStore.farms.slice()}
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
                      this.props.navigation.navigate("Farm", {
                        farmKey: item.key
                      });
                    }}
                    title={item.name}
                  />
                )}
              />
            </View>
            <Text style={styles.text}>Settings</Text>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.navigate("Settings")}
              title="Settings"
            />

            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.navigate("Calculator")}
              title="Calculator"
            />

            <Text style={styles.text}>Manure</Text>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.navigate("CustomManure")}
              title="Add a new manure"
            />
            <View>
              <FlatList<Manure>
                data={this.props.ManureStore.manures.slice()}
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
                      this.props.navigation.navigate("CustomManure", {
                        manure: item
                      });
                    }}
                    title={item.name}
                  />
                )}
              />
            </View>
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.navigate("Export")}
              title="Export Data"
            />
            <Button
              buttonStyle={styles.roundButton}
              titleStyle={styles.buttonText}
              onPress={() => this.clearStore()}
              title="Clear Store"
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
  private clearStore = () => {
    database.delete().then(() => database.getAppSettings());
    this.props.FarmStore.farms = new Array<Farm>();
    this.props.ManureStore.manures = new Array<Manure>();
  };
}
