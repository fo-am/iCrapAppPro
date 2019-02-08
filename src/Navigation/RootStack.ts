import { createStackNavigator, NavigationContainer } from "react-navigation";
import Calculator from "../calc/Calculator";
import CustomManure from "../customManure/CustomManure";
import FieldScreen from "../Fields/FieldScreen";
import SpreadScreen from "../Fields/SpreadScreen";
import HomeScreen from "../HomeScreen";
import SettingScreen from "../Settings/SettingScreen";
import SplashScreen from "../splashScreen/splashScreen";

export default createStackNavigator(
    {
        Calculator: { screen: Calculator },
        CustomManure: { screen: CustomManure },
        Home: { screen: HomeScreen, navigationOptions: { header: null } },
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: { header: null }
        },
        Field: { screen: FieldScreen },
        Spread: { screen: SpreadScreen },
        Settings: { screen: SettingScreen }
    },
    {
        initialRouteName: "SplashScreen"
    }
);
