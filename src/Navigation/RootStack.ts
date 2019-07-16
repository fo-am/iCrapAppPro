import { createAppContainer, createStackNavigator } from "react-navigation";
import Calculator from "../Calc/Calculator";
import Camera from "../Camera/camera";
import CropSelector from "../components/CropSelector";
import CustomManure from "../CustomManure/CustomManure";
import ExportScreen from "../Export/ExportScreen";
import FarmScreen from "../Farm/FarmScreen";
import FieldScreen from "../Fields/FieldScreen";
import SpreadScreen from "../Fields/SpreadScreen";
import HomeScreen from "../HomeScreen";
import SettingScreen from "../Settings/SettingScreen";
import SplashScreen from "../splashScreen/splashScreen";
import styles from "../styles/style";

const appNav = createStackNavigator(
    {
        Calculator: {
            screen: Calculator,
            navigationOptions: { title: "Calculator" }
        },
        Camera: {
            screen: Camera,
            navigationOptions: { header: null }
        },
        CustomManure: {
            screen: CustomManure,
            navigationOptions: { title: "Custom Manure" }
        },
        Home: {
            screen: HomeScreen,
            navigationOptions: { header: null }
        },
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: { header: null }
        },
        Farm: {
            screen: FarmScreen,
            navigationOptions: { header: null }
        },
        Field: {
            screen: FieldScreen,
            navigationOptions: { header: null }
        },
        Spread: {
            screen: SpreadScreen,
            navigationOptions: { header: null }
        },
        Settings: {
            screen: SettingScreen,
            navigationOptions: { title: "Settings" }
        },
        CropSelector: {
            screen: CropSelector,
            navigationOptions: { header: null }
        },
        Export: {
            screen: ExportScreen,
            navigationOptions: {
                title: "Export Data",
                headerTitleStyle: {
                    fontFamily: "ArimaMadurai-Regular",
                    color: "#000",
                    fontSize: 28
                }
            }
        }
    },
    {
        initialRouteName: "SplashScreen"
    }
);

export default createAppContainer(appNav);
