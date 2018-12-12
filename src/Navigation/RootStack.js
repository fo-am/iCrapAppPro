import { createStackNavigator } from "react-navigation";
import MapScreen from "../Map";
import HomeScreen from "../HomeScreen";
import Calculator from "../calc/Calculator";
import CustomManure from "../customManure/CustomManure";

export default (RootStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Map: {
            screen: MapScreen
        },
        Calculator: {
            screen: Calculator
        },
        CustomManure: {
            screen: CustomManure
        }
    },
    {
        initialRouteName: "Home"
    }
));
