import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import Strings from "../assets/Strings";
import DropDown from "./../components/DropDown";
import Manure from "./../model/manure";
import styles from "./../styles/style";
import ImportFileCheck from "../Export/ImportFileCheck";

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
  private strings = new Strings();
  constructor(props) {
    super(props);
  }

  public componentWillMount() {
    const { navigation, ManureStore } = this.props;
    const item = navigation.getParam("manure", undefined);
    if (item) {
      ManureStore.getManure(item.key).then(
        (manure: Manure) => (ManureStore.manure = manure)
      );
    } else {
      ManureStore.manure = new Manure();
    }
  }

  public render() {
    const { ManureStore } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ImportFileCheck navigation={this.props.navigation} />
        <StatusBar barStyle="dark-content" />

        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.text}>Manure Name</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="default"
              placeholder="New Manure"
              onChangeText={text => (ManureStore.manure.name = text)}
            >
              {ManureStore.manure.name}
            </Input>
            <Text style={styles.text}>N kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text => (ManureStore.manure.N = parseFloat(text))}
            >
              <Text style={styles.text}>{ManureStore.manure.N}</Text>
            </Input>
            <Text style={styles.text}>P kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text => (ManureStore.manure.P = parseFloat(text))}
            >
              <Text style={styles.text}>{ManureStore.manure.P}</Text>
            </Input>
            <Text style={styles.text}>K kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text => (ManureStore.manure.K = parseFloat(text))}
            >
              <Text style={styles.text}>{ManureStore.manure.K}</Text>
            </Input>
            <Text style={styles.text}>S kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text => (ManureStore.manure.S = parseFloat(text))}
            >
              <Text style={styles.text}>{ManureStore.manure.S}</Text>
            </Input>
            <Text style={styles.text}>Mg kg/t content (elemental)</Text>
            <Input
              selectTextOnFocus={true}
              inputStyle={styles.TextInputBold}
              inputContainerStyle={styles.outline}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={text => (ManureStore.manure.Mg = parseFloat(text))}
            >
              <Text style={styles.text}>{ManureStore.manure.Mg}</Text>
            </Input>
            <Text style={styles.text}>Custom manure type</Text>
            <DropDown
              style={styles.outline}
              selectedValue={ManureStore.manure.Type}
              onChange={item => (ManureStore.manure.Type = item)}
              values={this.strings.customManureTypes}
            />
            <View style={{ marginTop: 40 }}>
              <Button
                buttonStyle={[styles.roundButton, styles.bgColourBlue]}
                titleStyle={styles.buttonText}
                onPress={this.cancel}
                title="Cancel"
              />
              <Button
                buttonStyle={[styles.roundButton, styles.bgColourRed]}
                titleStyle={styles.buttonText}
                onPress={this.deleteManure}
                title="Delete"
              />
              <Button
                buttonStyle={[styles.roundButton]}
                titleStyle={styles.buttonText}
                onPress={this.saveManure}
                title="Save"
              />
            </View>
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
    const { navigation, ManureStore } = this.props;
    ManureStore.saveManure();
    navigation.navigate("Home");
  };

  private deleteManure = () => {
    const { navigation, ManureStore } = this.props;
    ManureStore.deleteManure();
    navigation.navigate("Home");
  };
  private cancel = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}
