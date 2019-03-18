import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const mapHeight = height / 2.5;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between"
    },
    text: { color: "#000" },
    map: {
        width,
        height: mapHeight
    }
});

export default styles;
