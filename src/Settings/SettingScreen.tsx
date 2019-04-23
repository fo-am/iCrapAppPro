import { inject, observer } from "mobx-react/native";
import {} from "native-base";
import React, { Component } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import styles from "../styles/style";

import DropDown from "../components/DropDown";

import { Button, Input } from "react-native-elements";

interface Props {
  SettingsStore: SettingsStore;
  navigation: NavigationScreenProp<any, any>;
}

interface State {}

@inject("SettingsStore")
@observer
export default class SettingScreen extends Component<Props, State> {
  public Units = {
    metric: "Metric",
    imperial: "Imperial"
  };

  public componentWillMount() {
    const { SettingsStore } = this.props;
    SettingsStore.getSettings();
  }
  public render() {
    const { SettingsStore } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View>
          <StatusBar />

          <View style={[styles.box, styles.bottomSpacing]}>
            <Text>Choose Unit type</Text>
            <DropDown
              style={styles.outline}
              selectedValue={SettingsStore.appSettings.unit}
              onChange={item => SettingsStore.SelectUnit(item)}
              values={this.Units}
            />
          </View>
          <View style={styles.box}>
            <Text>Email address</Text>

            <Input
              selectTextOnFocus={true}
              inputStyle={{ fontSize: 20, fontWeight: "bold" }}
              inputContainerStyle={styles.outline}
              containerStyle={styles.bottomSpacing}
              placeholder="Email"
              onChangeText={email => (SettingsStore.appSettings.email = email)}
            >
              {SettingsStore.appSettings.email}
            </Input>
          </View>
          <Button
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            onPress={() => this.Save()}
            title="Save"
          />
        </View>
      </SafeAreaView>
    );
  }

  private Save() {
    const { SettingsStore, navigation } = this.props;
    SettingsStore.SaveSettings().then(() => navigation.navigate("Home"));
  }
}
