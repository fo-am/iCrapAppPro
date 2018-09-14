import React from "react";
import { Button, View, Text } from "react-native";
import { StackNavigator } from "react-navigation";
import RootStack from "./Navigation/Navigation";

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
