import { inject, observer } from "mobx-react/native";
import { Button, Container, Content, Form, Input, Text } from "native-base";
import React, { Component } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import styles from "../styles/style";

import DropDown from "../components/DropDown";

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
        <Container>
          <Content>
            <Form>
              <StatusBar />
              <ScrollView>
                <View style={styles.container}>
                  <Text>Choose Unit type</Text>
                  <DropDown
                    selectedValue={SettingsStore.appSettings.unit}
                    onChange={item => SettingsStore.SelectUnit(item)}
                    values={this.Units}
                  />
                  <Text>Email address</Text>
                  <Input
                    selectTextOnFocus={true}
                    style={{ fontSize: 20, fontWeight: "bold" }}
                    placeholder="your@email.com"
                    onChangeText={email =>
                      (SettingsStore.appSettings.email = email)
                    }
                  >
                    {SettingsStore.appSettings.email}
                  </Input>
                </View>
                <Button onPress={() => this.Save()}>
                  <Text>Save</Text>
                </Button>
              </ScrollView>
            </Form>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  private Save() {
    const { SettingsStore, navigation } = this.props;
    SettingsStore.SaveSettings().then(() => navigation.navigate("Home"));
  }
}
