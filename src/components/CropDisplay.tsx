import React, { Component } from "react";
import { translate } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import styles from "../styles/style";

interface Props {
  cropArray: Array<Array<string>>;
}

interface State {}

@translate(["common"], { wait: true })
export default class CropDisplay extends Component<Props, State> {
  public render() {
    const { t, i18n } = this.props;
    return (
      <View
        style={[
          { flex: 1, alignItems: "center", justifyContent: "center" },
          styles.outline
        ]}
      >
        <Text style={styles.H3}>Crop: {t(this.getCrop())}</Text>
        <FlatList
          contentContainerStyle={[
            { flex: 1, alignItems: "center", justifyContent: "center" }
          ]}
          keyExtractor={item => item[0]}
          data={this.props.cropArray.filter(item => item[0] !== "crop")}
          renderItem={({ item }) => (
            <Text style={styles.text}>
              {t(item[0])}: {t(item[1])}
            </Text>
          )}
        />
      </View>
    );
  }

  private getCrop(): string {
    let cropName: string = "";
    this.props.cropArray.some(element => {
      if (element[0] === "crop") {
        cropName = element[1];
      }
    });
    return cropName;
  }
}
