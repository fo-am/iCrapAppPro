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
