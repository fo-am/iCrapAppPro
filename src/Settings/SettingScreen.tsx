import { inject, observer } from "mobx-react/native";
import { Container, Content, Form } from "native-base";
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  Slider,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import Images from "../assets/imageData";
import styles from "../styles/style";

import DropDown from "../components/DropDown";
import settingsStore from "../store/settingsStore";

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
  public RainfallTypes = {
    "rain-high": "High (> 700mm)",
    "rain-medium": "Medium (600-700mm)",
    "rain-low": "Low (< 600mm)"
  };
  public componentWillMount() {
    const { SettingsStore } = this.props;
    SettingsStore.getSettings();
  }
  public render() {
    const { SettingsStore } = this.props;
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView>
              <View style={styles.container}>
                <StatusBar />
                <Text>Choose Unit type</Text>
                <DropDown
                  selectedValue={SettingsStore.appSettings.unit}
                  onChange={item => SettingsStore.SelectUnit(item)}
                  values={this.Units}
                />
                <Text>Set Farm Rainfall</Text>
                <DropDown
                  selectedValue={SettingsStore.rainfall}
                  onChange={item => SettingsStore.SelectRainfall(item)}
                  values={this.RainfallTypes}
                />
                <Text>
                  How much do you pay for your fertiliser? This is used to
                  calculate your cost savings.
                </Text>
                <Text>N(£ per Kg)</Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={item => SettingsStore.SetNCost(item)}
                  value={SettingsStore.NCost}
                  selectTextOnFocus={true}
                />
                <Text>
                  P<Text style={{ fontSize: 11, lineHeight: 37 }}>2</Text>O
                  <Text style={{ fontSize: 11, lineHeight: 37 }}>5</Text>(£ per
                  Kg)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={item => SettingsStore.SetPCost(item)}
                  value={SettingsStore.PCost}
                  selectTextOnFocus={true}
                />
                <Text>
                  K<Text style={{ fontSize: 11, lineHeight: 37 }}>2</Text>
                  O(£ per Kg)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={item => SettingsStore.SetKCost(item)}
                  value={SettingsStore.KCost}
                  selectTextOnFocus={true}
                />
              </View>
              <Button
                title="Save"
                onPress={() => this.Save()}
                accessibilityLabel="Save Settings"
              />
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }

  public Save() {
    this.props.SettingsStore.SaveSettings().then(() =>
      this.props.navigation.navigate("Home")
    );
  }
}
