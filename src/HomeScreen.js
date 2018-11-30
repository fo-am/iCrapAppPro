import React, { Component } from "react";
import { Button, View, Text, FlatList, ScrollView } from "react-native";
import store from "react-native-simple-store";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { manures: [] };
  }

  componentDidMount() {
    //  store.delete("customManure");
  }
  render() {
    store.get("customManure").then(res => this.setState({ manures: res }));
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
          title="Go to manure"
          onPress={() => this.props.navigation.navigate("CustomManure")}
        />
        <ScrollView>
          <FlatList
            data={this.state.manures}
            renderItem={({ item }) => (
              <Button
                title={item.name}
                onPress={() =>
                  this.props.navigation.navigate("CustomManure", {
                    manure: item
                  })
                }
              />
            )}
          />
        </ScrollView>
      </View>
    );
  }
}
