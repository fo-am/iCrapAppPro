import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { Button, FlatList, ScrollView, Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
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
      <View style={styles.container}>
        <Text>Add a farm</Text>
        <Button
          title="Add new farm"
          onPress={() =>
            this.props.navigation.navigate("Farm", {
              farmKey: undefined
            })
          }
        />
        <ScrollView>
          <FlatList<Farm>
            data={this.props.FarmStore.farms.slice()}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <Button
                title={item.name}
                onPress={() => {
                  this.props.navigation.navigate("Farm", {
                    farmKey: item.key
                  });
                }}
              />
            )}
          />
        </ScrollView>
        <Text>Settings</Text>
        <Button
          title="Settings"
          onPress={() => this.props.navigation.navigate("Settings")}
        />
        <Text>Calc</Text>
        <Button
          title="Go to Calc"
          onPress={() => this.props.navigation.navigate("Calculator")}
        />
        <Text>Manure</Text>
        <Button
          title="Add a new manure"
          onPress={() => this.props.navigation.navigate("CustomManure")}
        />
        <ScrollView>
          <FlatList<Manure>
            data={this.props.ManureStore.manures.slice()}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <Button
                title={item.name}
                onPress={() => {
                  this.props.navigation.navigate("CustomManure", {
                    manure: item
                  });
                }}
              />
            )}
          />
        </ScrollView>
        <Button title="clear store" onPress={() => this.clearStore()} />
      </View>
    );
  }
  private clearStore = () => {
    database.delete();
  };
}
