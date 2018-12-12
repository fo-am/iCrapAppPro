import { Provider } from "mobx-react/native";
import React from "react";
import RootStack from "./navigation/RootStack";
import ManureStore from "./store/manureStore";

const store = new ManureStore();

export default class App extends React.Component {
  public render() {
    return (
      <Provider ManureStore={store}>
        <RootStack />
      </Provider>
    );
  }
}
