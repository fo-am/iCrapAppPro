import { Provider } from "mobx-react/native";
import React from "react";
import RootStack from "./navigation/RootStack";
import CalculatorStore from "./store/calculatorStore";
import FieldStore from "./store/FieldsStore";
import ManureStore from "./store/manureStore";
import SettingsStore from "./store/settingsStore";

export default class App extends React.Component {
  public render() {
    return (
      <Provider
        ManureStore={ManureStore}
        SettingsStore={SettingsStore}
        FieldStore={FieldStore}
        CalculatorStore={CalculatorStore}
      >
        <RootStack />
      </Provider>
    );
  }
}
