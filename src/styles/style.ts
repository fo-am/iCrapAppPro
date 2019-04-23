import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const mapHeight = height / 2.5;
const defatFontSize = 20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d6d6d6",
        justifyContent: "space-between",
        padding: "2%",
        marginTop: "2%"
    },
    box: {
        backgroundColor: "#d6d6d6",
        justifyContent: "space-between",
        padding: "2%",
        marginTop: "2%"
    },
    text: { color: "#000" },
    H1: { fontSize: defatFontSize * 1.8 },
    map: {
        width,
        height: mapHeight
    },
    roundButton: {
        backgroundColor: "#89BF89",
        margin: 5,
        borderWidth: 3,
        borderColor: "black",
        borderRadius: 20
    },
    footerButton: {
        backgroundColor: "#89BF89",
        margin: 5
    },
    buttonText: {
        fontFamily: "ArimaMadurai-Regular",
        color: "black",
        fontSize: defatFontSize
    },
    outline: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        backgroundColor: "white"
    },
    leftBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "black",
        backgroundColor: "white",
        padding: 1
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderColor: "black",
        backgroundColor: "white",
        padding: 1
    },
    bottomSpacing: { paddingBottom: 10 }
});

export default styles;
