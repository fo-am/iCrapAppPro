import { StackNavigator } from "react-navigation";
import MapScreen from "../Map";
import HomeScreen from "../HomeScreen";

export default (RootStack = StackNavigator(
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
));
