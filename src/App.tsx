import { Provider } from "mobx-react/native";
import { StyleProvider } from "native-base";
import React from "react";
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";
import RootStack from "./navigation/RootStack";
import CalculatorStore from "./store/calculatorStore";
import FarmStore from "./store/FarmStore";
import FieldStore from "./store/FieldsStore";
import ManureStore from "./store/manureStore";
import SettingsStore from "./store/settingsStore";

export default class App extends React.Component {
  public render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Provider
          ManureStore={ManureStore}
          SettingsStore={SettingsStore}
          FieldStore={FieldStore}
          CalculatorStore={CalculatorStore}
          FarmStore={FarmStore}
        >
          <RootStack />
        </Provider>
      </StyleProvider>
    );
  }
}
