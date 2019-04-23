import { inject, observer } from "mobx-react/native";
import { Button, Container, Content, Form, Input, Text } from "native-base";
import React, { Component } from "react";
import { StatusBar, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Container>
          <Content>
            <Form>
              <StatusBar />
              <View style={styles.container}>
                <Text style={styles.text}>Manure Name</Text>

                <Input
                  autoFocus={true}
                  selectTextOnFocus={true}
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  keyboardType="default"
                  placeholder="New Manure"
                  onChangeText={text =>
                    (this.props.ManureStore.manure.name = text)
                  }
                >
                  {this.props.ManureStore.manure.name}
                </Input>

                <Text style={styles.text}>N kg/t content (elemental)</Text>

                <Input
                  selectTextOnFocus={true}
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  keyboardType="numeric"
                  placeholder="0"
                  onChangeText={text =>
                    (this.props.ManureStore.manure.N = parseFloat(text))
                  }
                >
                  {this.toString(this.props.ManureStore.manure.N)}
                </Input>

                <Text style={styles.text}>P kg/t content (elemental)</Text>
                <Input
                  selectTextOnFocus={true}
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  keyboardType="numeric"
                  placeholder="0"
                  onChangeText={text =>
                    (this.props.ManureStore.manure.P = parseFloat(text))
                  }
                >
                  {this.toString(this.props.ManureStore.manure.P)}
                </Input>

                <Text style={styles.text}>K kg/t content (elemental)</Text>

                <Input
                  selectTextOnFocus={true}
                  style={{ fontSize: 20, fontWeight: "bold" }}
                  keyboardType="numeric"
                  placeholder="0"
                  onChangeText={text =>
                    (this.props.ManureStore.manure.K = parseFloat(text))
                  }
                >
                  {this.toString(this.props.ManureStore.manure.K)}
                </Input>

                <Button onPress={this.cancel}>
                  <Text style={styles.text}>Cancel</Text>
                </Button>
                <Button onPress={this.saveManure}>
                  <Text style={styles.text}>Save Manure</Text>
                </Button>
                <Button onPress={this.deleteManure}>
                  <Text style={styles.text}>Remove manure</Text>
                </Button>
              </View>
            </Form>
          </Content>
        </Container>
      </SafeAreaView>
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
