import { inject, observer } from "mobx-react/native";
import { Button, Container, Content, Form, Input, Text } from "native-base";
import React, { Component } from "react";
import { View } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import Manure from "./../model/manure";
import styles from "./../styles/style";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
  ManureStore: ManureStore;
}

interface MyComponentState {}

@inject("ManureStore")
@observer
export default class CustomManure extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
  }

  public componentWillMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("manure", undefined);
    if (item) {
      this.props.ManureStore.manure = this.props.ManureStore.getManure(
        item.key
      );
    } else {
      this.props.ManureStore.manure = new Manure();
    }
  }

  public render() {
    return (
      <Container>
        <Content>
          <Form>
            <View style={styles.container}>
              <Text>Manure Name</Text>

              <Input
                autoFocus={true}
                keyboardType="default"
                placeholder="New Manure"
                onChangeText={text =>
                  (this.props.ManureStore.manure.name = text)
                }
              >
                {this.props.ManureStore.manure.name}
              </Input>

              <Text>N kg/t content (elemental)</Text>

              <Input
                keyboardType="numeric"
                placeholder="0"
                onChangeText={text =>
                  (this.props.ManureStore.manure.N = parseFloat(text))
                }
              >
                {this.toString(this.props.ManureStore.manure.N)}
              </Input>

              <Text>P kg/t content (elemental)</Text>
              <Input
                keyboardType="numeric"
                placeholder="0"
                onChangeText={text =>
                  (this.props.ManureStore.manure.P = parseFloat(text))
                }
              >
                {this.toString(this.props.ManureStore.manure.P)}
              </Input>

              <Text>K kg/t content (elemental)</Text>

              <Input
                keyboardType="numeric"
                placeholder="0"
                onChangeText={text =>
                  (this.props.ManureStore.manure.K = parseFloat(text))
                }
              >
                {this.toString(this.props.ManureStore.manure.K)}
              </Input>

              <Button onPress={this.cancel}>
                <Text>Cancel</Text>
              </Button>
              <Button onPress={this.saveManure}>
                <Text>Save Manure</Text>
              </Button>
              <Button onPress={this.deleteManure}>
                <Text>Remove manure</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }

  private toString<T>(input: T): string {
    let retval: string = "";
    input ? (retval = input.toString()) : (retval = "");
    return retval;
  }

  private saveManure = () => {
    this.props.ManureStore.saveManure();
    this.props.navigation.navigate("Home");
  };

  private deleteManure = () => {
    this.props.ManureStore.deleteManure();
    this.props.navigation.navigate("Home");
  };
  private cancel = () => {
    this.props.navigation.goBack();
  };
}
