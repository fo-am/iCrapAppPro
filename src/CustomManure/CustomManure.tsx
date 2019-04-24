import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
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
        <StatusBar barStyle="dark-content" />

        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.text}>Manure Name</Text>
            <Input
              autoFocus={true}
              selectTextOnFocus={true}
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
              keyboardType="default"
              placeholder="New Manure"
              onChangeText={text => (this.props.ManureStore.manure.name = text)}
            >
              {this.props.ManureStore.manure.name}
            </Input>
            <Text style={styles.text}>N kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
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
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
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
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text =>
                (this.props.ManureStore.manure.K = parseFloat(text))
              }
            >
              {this.toString(this.props.ManureStore.manure.K)}
            </Input>
            <Text style={styles.text}>S kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text =>
                (this.props.ManureStore.manure.S = parseFloat(text))
              }
            >
              {this.toString(this.props.ManureStore.manure.K)}
            </Input>
            <Text style={styles.text}>Mg kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text =>
                (this.props.ManureStore.manure.Mg = parseFloat(text))
              }
            >
              {this.toString(this.props.ManureStore.manure.K)}
            </Input>
            <Button
              buttonStyle={[styles.roundButton, styles.bgColourBlue]}
              titleStyle={styles.buttonText}
              onPress={this.cancel}
              title="Cancel"
            />
            <Button
              buttonStyle={[styles.roundButton]}
              titleStyle={styles.buttonText}
              onPress={this.saveManure}
              title="Save Manure"
            />
            <Button
              buttonStyle={[styles.roundButton, styles.bgColourRed]}
              titleStyle={styles.buttonText}
              onPress={this.deleteManure}
              title="Remove manure"
            />
          </ScrollView>
        </View>
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
