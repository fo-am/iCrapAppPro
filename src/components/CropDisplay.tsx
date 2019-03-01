import { Form, Text } from "native-base";
import React, { Component } from "react";
import { translate } from "react-i18next";
import { FlatList } from "react-native";

interface Props {
  cropArray: Array<Array<string>>;
}

interface State {}

@translate(["common"], { wait: true })
export default class CropDisplay extends Component<Props, State> {
  public render() {
    const { t, i18n } = this.props;
    return (
      <Form>
        <Text>Crop: {this.getCrop()}</Text>
        <FlatList
          keyExtractor={item => item[0]}
          data={this.props.cropArray.filter(item => item[0] !== "crop")}
          renderItem={({ item }) => (
            <Text>
              {t(item[0])}: {t(item[1])}
            </Text>
          )}
        />
      </Form>
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