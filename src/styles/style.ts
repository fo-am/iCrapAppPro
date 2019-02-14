import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const halfHeight = height / 2;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between"
    },
    text: { color: "#FFF" },
    map: {
        width,
        height: halfHeight
    },
    topBar: {
        height: Platform.OS === "ios" ? 20 : StatusBar.currentHeight
    },
    bubble: {
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    sub: { fontSize: 15, lineHeight: 37 }
});

export default styles;
