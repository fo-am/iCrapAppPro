import React, { Component } from "react";
import { NavigationScreenProp } from "react-navigation";
import RNFS from "react-native-fs";
import { AppState } from "react-native";

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {}

export default class ImportFileCheck extends Component<Props, State> {
  private _handleAppStateChange = nextAppState => {
    if (nextAppState === "active") {
      RNFS.exists(
        RNFS.DocumentDirectoryPath + "/Inbox/FarmsData.json.enc"
      ).then(exists => {
        if (exists) {
          this.props.navigation.navigate("Export");
        }
      });
    }
  };

  constructor(props) {
    super(props);
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  public componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }
  public render() {
    return null;
  }
}
