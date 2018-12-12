import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { Button, FlatList, ScrollView, Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import ManureStore from "./store/manureStore";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
  ManureStore: ManureStore;
}

interface MyComponentState {}

@inject("ManureStore")
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
      </View>
    );
  }
}
