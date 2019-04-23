import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const mapHeight = height / 2.5;
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
    map: {
        width,
        height: mapHeight
    },
    button: {
        backgroundColor: "#89BF89",
        margin: 5,
        borderWidth: 3,
        borderColor: "black",
        borderRadius: 20
    },
    buttonText: {
        fontFamily: "ArimaMadurai-Regular",
        color: "black",
        fontSize: 20
    },
    outline: { borderWidth: 1, borderColor: "black", borderRadius: 20 },
    bottomSpacing: { paddingBottom: 10 }
});

export default styles;
