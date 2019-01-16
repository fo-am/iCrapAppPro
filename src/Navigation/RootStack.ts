import { createStackNavigator, NavigationContainer } from "react-navigation";
import Calculator from "../calc/Calculator";
import CustomManure from "../customManure/CustomManure";
import FieldScreen from "../Fields/FieldScreen";
import SpreadScreen from "../Fields/SpreadScreen";
import HomeScreen from "../HomeScreen";
import MapScreen from "../Map";
import SettingScreen from "../Settings/SettingScreen";

export default createStackNavigator(
  {
    Calculator: {
      screen: Calculator
    },
    CustomManure: {
      screen: CustomManure
    },
    Home: {
      screen: HomeScreen
    },
    Map: {
      screen: MapScreen
    },
    Field: {
      screen: FieldScreen
    },
    Spread: {
      screen: SpreadScreen
    },
    Settings: {
      screen: SettingScreen
    }
  },
  {
    initialRouteName: "Home"
  }
);
