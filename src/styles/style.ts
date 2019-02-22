import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const halfHeight = height / 2;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between"
    },
    text: { color: "#000" },
    map: {
        width,
        height: halfHeight
    }
});

export default styles;
