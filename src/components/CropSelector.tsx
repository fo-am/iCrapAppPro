import { inject, observer } from "mobx-react/native";
import { Button, Container, Content, Form, H1, Text } from "native-base";
import React, { Component } from "react";
import { translate } from "react-i18next";
import { FlatList, ScrollView, StatusBar, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import data from "../assets/data/crop-menu.json";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
}

interface State {
  data: any;
  category: string;
  result: Array<string>;
}

@translate(["common"], { wait: true })
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
    const { t, i18n } = this.props;
    return (
      <Container>
        <Content>
          <Form>
            <StatusBar />
            <ScrollView>
              <H1>Expert crop select</H1>
              <FlatList
                keyExtractor={(item, index) => "key" + index}
                data={this.state.data}
                renderItem={({ item }) => (
                  <Button
                    style={{ width: "75%" }}
                    onPress={() => this.buttonPress(item)}
                  >
                    <Text>{t(item.name) || t(item)}</Text>
                  </Button>
                )}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Button
                  block
                  info
                  style={{ width: "50%" }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  block
                  success
                  style={{ width: "50%" }}
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
              </View>
            </ScrollView>
          </Form>
        </Content>
      </Container>
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
