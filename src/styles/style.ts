import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const mapHeight = Math.max(width, height) / 2.5;

const defaultFontSize = 20;

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
    narrow: {
        backgroundColor: "#d6d6d6",
        paddingLeft: "2%",
        paddingRight: "2%"
    },
    text: {
        fontFamily: "ArimaMadurai-Regular",
        color: "#000",
        fontSize: defaultFontSize
    },
    H1: { fontFamily: "ArimaMadurai-Regular", fontSize: defaultFontSize * 1.8 },
    H2: { fontFamily: "ArimaMadurai-Regular", fontSize: defaultFontSize * 1.6 },
    H3: { fontFamily: "ArimaMadurai-Regular", fontSize: defaultFontSize * 1.4 },
    map: {
        width: "100%",
        height: mapHeight
    },
    roundButton: {
        backgroundColor: "#89BF89",
        margin: 5,
        borderWidth: 3,
        borderColor: "black",
        borderRadius: 20
    },
    bgColourBlue: {
        backgroundColor: "#89b4bf"
    },
    bgColourRed: {
        backgroundColor: "#bf8989"
    },
    footerButton: {
        backgroundColor: "#89BF89",
        margin: 5
    },
    buttonText: {
        fontFamily: "ArimaMadurai-Regular",
        color: "black",
        fontSize: defaultFontSize
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
