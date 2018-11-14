import { StackNavigator } from "react-navigation";
import MapScreen from "../Map";
import HomeScreen from "../HomeScreen";
import Calculator from "../Calc/Calculator";

export default (RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Map: {
      screen: MapScreen
    },
    Calculator: {
      screen: Calculator
    }
  },
  {
    initialRouteName: "Home"
  }
));
