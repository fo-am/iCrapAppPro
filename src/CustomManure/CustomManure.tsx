import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { Maths } from "../assets/Math";
import ManureStore from "../store/manureStore";
import Manure from "./../model/manure";
import styles from "./../styles/style";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
  ManureStore: ManureStore;
}

interface MyComponentState {
  manure: Manure;
}

@inject("ManureStore")
@observer
export default class CustomManure extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
    this.state = {
      manure: {
        key: Maths.generateUUID(),
        name: "",
        N: undefined,
        P: undefined,
        K: undefined
      }
    };
  }

  public componentWillMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("manure", undefined);
    if (item) {
      this.setState({ manure: item });
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <Text>Manure Name</Text>
        <TextInput
          //    defaultValue="My Manure"
          //    style={styles.textInput}
          keyboardType="default"
          onChangeText={text =>
            this.setState({ manure: { ...this.state.manure, name: text } })
          }
          placeholder="New Name"
          value={this.state.manure.name}
        />
        <Text>N kg/t content (elemental)</Text>
        <TextInput
          //    defaultValue="0"
          //    style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text =>
            this.setState({
              manure: { ...this.state.manure, N: parseFloat(text) }
            })
          }
          placeholder="0"
          value={this.toString(this.state.manure.N)}
        />
        <Text>P kg/t content (elemental)</Text>
        <TextInput
          //     defaultValue="0"
          //     style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text =>
            this.setState({
              manure: { ...this.state.manure, P: parseFloat(text) }
            })
          }
          placeholder="0"
          value={this.toString(this.state.manure.P)}
        />
        <Text>K kg/t content (elemental)</Text>
        <TextInput
          //      defaultValue="0"
          //     style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text =>
            this.setState({
              manure: { ...this.state.manure, K: parseFloat(text) }
            })
          }
          placeholder="0"
          value={this.toString(this.state.manure.K)}
        />
        <Button title="Cancel" onPress={this.cancel} />
        <Button title="OK" onPress={this.saveManure} />
        <Button title="Remove this manure" onPress={this.deleteManure} />
        <Text>foo {JSON.stringify(this.state.manure)}</Text>
      </View>
    );
  }

  private toString<T>(input: T): string {
    let retval: string = "";
    input ? (retval = input.toString()) : (retval = "");
    return retval;
  }

  private saveManure = () => {
    this.props.ManureStore.saveManure(this.state.manure);
    this.props.navigation.navigate("Home");
  }

  private deleteManure = () => {
    this.props.ManureStore.deleteManure(this.state.manure);
    this.props.navigation.navigate("Home");
  }
  private cancel = () => {
    this.props.navigation.goBack();
  }
}
