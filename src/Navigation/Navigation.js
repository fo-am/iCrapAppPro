import React from "react";
import { StackNavigator } from "react-navigation";
import MapScreen from "./../Map";
import HomeScreen from "./../HomeScreen";

export default const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Map: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: "Home"
  }
);
