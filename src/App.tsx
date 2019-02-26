import { Provider } from "mobx-react/native";
import { StyleProvider } from "native-base";
import React from "react";
import { I18nextProvider, translate } from "react-i18next";
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";
import RootStack from "./navigation/RootStack";
import CalculatorStore from "./store/calculatorStore";
import FarmStore from "./store/FarmStore";
import FieldStore from "./store/FieldsStore";
import ManureStore from "./store/manureStore";
import SettingsStore from "./store/settingsStore";

import i18n from "./translations/i18n";

const WrappedStack = () => {
  return <RootStack screenProps={{ t: i18n.getFixedT() }} />;
};

const ReloadAppOnLanguageChange = translate("translation", {
  bindI18n: "languageChanged",
  bindStore: false
})(WrappedStack);

export default class App extends React.Component {
  public render() {
    return (
      <I18nextProvider i18n={i18n}>
        <StyleProvider style={getTheme(platform)}>
          <Provider
            ManureStore={ManureStore}
            SettingsStore={SettingsStore}
            FieldStore={FieldStore}
            CalculatorStore={CalculatorStore}
            FarmStore={FarmStore}
          >
            <ReloadAppOnLanguageChange />
          </Provider>
        </StyleProvider>
      </I18nextProvider>
    );
  }
}
// https://github.com/stefalda/ReactNativeLocalization
// https://medium.com/@danielsternlicht/adding-localization-i18n-g11n-to-a-react-native-project-with-rtl-support-223f39a8e6f2
