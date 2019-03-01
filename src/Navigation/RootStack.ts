import { createAppContainer, createStackNavigator } from "react-navigation";
import Calculator from "../calc/Calculator";
import CropSelector from "../components/CropSelector";
import CustomManure from "../customManure/CustomManure";
import ExportScreen from "../Export/ExportScreen";
import FarmScreen from "../Farm/FarmScreen";
import FieldScreen from "../Fields/FieldScreen";
import SpreadScreen from "../Fields/SpreadScreen";
import HomeScreen from "../HomeScreen";
import SettingScreen from "../Settings/SettingScreen";
import SplashScreen from "../splashScreen/splashScreen";
const appNav = createStackNavigator(
    {
        Calculator: { screen: Calculator },
        CustomManure: { screen: CustomManure },
        Home: { screen: HomeScreen, navigationOptions: { header: null } },
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: { header: null }
        },
        Farm: { screen: FarmScreen },
        Field: { screen: FieldScreen },
        Spread: { screen: SpreadScreen },
        Settings: { screen: SettingScreen },
        CropSelector: {
            screen: CropSelector,
            navigationOptions: { header: null }
        },
        Export: { screen: ExportScreen }
    },
    {
        initialRouteName: "SplashScreen"
    }
);

export default createAppContainer(appNav);
