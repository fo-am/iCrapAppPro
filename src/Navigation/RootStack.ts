import { createStackNavigator, NavigationContainer } from "react-navigation";
import Calculator from "../calc/Calculator";
import CustomManure from "../customManure/CustomManure";
import HomeScreen from "../HomeScreen";
import MapScreen from "../Map";

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
    }
  },
  {
    initialRouteName: "Home"
  }
);
