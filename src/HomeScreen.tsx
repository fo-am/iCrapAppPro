import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { Button, FlatList, ScrollView, Text, View } from "react-native";
import store from "react-native-simple-store";
import { NavigationScreenProp } from "react-navigation";
import FieldStore from "./store/FieldsStore";
import ManureStore from "./store/manureStore";
import styles from "./styles/style";

import Data from "./data";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
  ManureStore: ManureStore;
  FieldStore: FieldStore;
}

interface MyComponentState {}

@inject("ManureStore", "FieldStore")
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
        <Text>Add a field</Text>
        <Button
          title="Add new field"
          onPress={() =>
            this.props.navigation.navigate("Field", {
              fieldKey: undefined
            })
          }
        />
        <ScrollView>
          <FlatList
            data={this.props.FieldStore.fields.slice()}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <Button
                title={item.name}
                onPress={() => {
                  this.props.navigation.navigate("Field", {
                    fieldKey: item.key
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
          <FlatList
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
    this.props.FieldStore.ClearStore();
    store.delete("settings");
    store.delete("costs");
  };
}
