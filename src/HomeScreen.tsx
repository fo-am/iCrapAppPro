import React, { Component } from "react";
import { Button, FlatList, ScrollView, Text, View } from "react-native";
import store from "react-native-simple-store";
import { NavigationScreenProp } from "react-navigation";
import Manure from "./model/manure";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
}
interface MyComponentState {
  manures: Array<Manure>;
  showList: boolean;
}

export default class HomeScreen extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
    this.state = {
      manures: [],
      showList: false
    };
  }

  public updateList = () => {
    store.get("customManure").then(res => this.setState({ manures: res }));
    this.setState({ showList: !this.state.showList });
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
        <Button title="Show Custom Manure" onPress={this.updateList} />
        {this.state.showList && (
          <ScrollView>
            <FlatList
              data={this.state.manures}
              keyExtractor={item => item.key}
              renderItem={({ item }) => (
                <Button
                  title={item.name}
                  onPress={() => {
                    this.setState({ showList: false });
                    this.props.navigation.navigate("CustomManure", {
                      manure: item
                    });
                  }}
                />
              )}
            />
          </ScrollView>
        )}
      </View>
    );
  }
}
