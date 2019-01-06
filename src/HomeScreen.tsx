import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { Button, FlatList, ScrollView, Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import ManureStore from "./store/manureStore";
import FieldStore from "./store/manureStore";

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Map"
          onPress={() => this.props.navigation.navigate("Map")}
        />
        <Text>This is text</Text>
        <Button
          title="Add new field"
          onPress={() => this.props.navigation.navigate("Field")}
        />
        <Text>This is also Text</Text>
        <ScrollView>
          <FlatList
            data={this.props.FieldStore.fields.slice()}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <Button
                title={item.name}
                onPress={() => {
                  this.props.navigation.navigate("Field", {
                    field: item
                  });
                }}
              />
            )}
          />
        </ScrollView>
        <Text>This is also Text</Text>
        <Button
          title="Go to Calc"
          onPress={() => this.props.navigation.navigate("Calculator")}
        />
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
        <Button title="clear store" onPress={this.clearStore} />
      </View>
    );
  }
  private clearStore = () => {
    this.props.FieldStore.ClearStore();
  };
}
