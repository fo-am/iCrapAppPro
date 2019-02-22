import { Form, Text } from "native-base";
import React, { Component } from "react";
import { FlatList } from "react-native";
interface Props {
  cropArray: Array<Array<string>>;
}

interface State {}

export default class CropDisplay extends Component<Props, State> {
  public render() {
    return (
      <Form>
        <Text>Crop: {this.getCrop()}</Text>
        <FlatList
          keyExtractor={item => item[0]}
          data={this.props.cropArray.filter(item => item[0] !== "crop")}
          renderItem={({ item }) => (
            <Text>
              {item[0]}: {item[1]}
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
