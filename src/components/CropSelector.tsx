import { inject, observer } from "mobx-react/native";
import { Button, Form, Text } from "native-base";
import React, { Component } from "react";
import { FlatList, ScrollView, View } from "react-native";
import data from "../assets/data/crop-menu.json";
import { NavigationScreenProp } from "react-navigation";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
}

interface State {
  data: any;
  category: string;
  result: Array<string>;
}
@inject("FieldStore")
@observer
export default class CropSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: data.options,
      category: data.category,
      result: []
    };
  }

  public render() {
    return (
      <ScrollView>
        <FlatList
          keyExtractor={(item, index) => "key" + index}
          data={this.state.data}
          renderItem={({ item }) => (
            <Button onPress={() => this.buttonPress(item)}>
              <Text>{item["name"] || item}</Text>
            </Button>
          )}
        />
        <Button onPress={() => this.props.navigation.goBack()}>
          <Text>Cancel</Text>
        </Button>
        <Button
          onPress={() => {
            this.setState({
              data: data.options,
              category: data.category,
              result: []
            });
          }}
        >
          <Text>Back</Text>
        </Button>
        <View>
          <Text>Test Data</Text>
          <Text>{JSON.stringify(this.state.result)}</Text>
          <Text>{this.state.category}</Text>
        </View>
      </ScrollView>
    );
  }
  private buttonPress(item) {
    // If we have a catagory then we have a next level.
    if (item.category) {
      this.setState({
        result: [...this.state.result, [this.state.category, item.name]]
      });
      this.setState({ category: item.category });
      this.setState({ data: item.options });
    } else {
      // end of the road!

      this.props.FieldStore.field.cropType = [
        ...this.state.result,
        [this.state.category, item]
      ];
      this.props.navigation.goBack();
    }
  }
}
