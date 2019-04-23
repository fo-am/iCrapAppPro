import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-elements";
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
        <View style={styles.container}>
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
          <ScrollView>
            <FlatList<Farm>
              data={this.props.FarmStore.farms.slice()}
              keyExtractor={item => item.key}
              renderItem={({ item }) => (
                <Button
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
          </ScrollView>

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
          <ScrollView>
            <FlatList<Manure>
              data={this.props.ManureStore.manures.slice()}
              keyExtractor={item => item.key}
              renderItem={({ item }) => (
                <Button
                  style={styles.roundButton}
                  onPress={() => {
                    this.props.navigation.navigate("CustomManure", {
                      manure: item
                    });
                  }}
                  title={item.name}
                />
              )}
            />
          </ScrollView>
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
