import { inject, observer } from "mobx-react";
import { Text } from "native-base";
import React, { Component } from "react";
import styles from "../styles/style";

interface Props {}

interface State {}

@inject("SettingsStore")
@observer
export default class DisplayAreaUnit extends Component<Props, State> {
  public render() {
    const { SettingsStore } = this.props;

    return SettingsStore.appSettings.unit === "metric" ? (
      <Text style={styles.text}>Kg/ha</Text>
    ) : (
      <Text style={styles.text}>units/acre</Text>
    );
  }
}
