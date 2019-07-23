import { inject, observer } from "mobx-react";
import { Text } from "native-base";
import React, { Component } from "react";

interface Props {}

interface State {}

@inject("SettingsStore")
@observer
export default class DisplayPoundsPerArea extends Component<Props, State> {
  public render() {
    const { SettingsStore } = this.props;

    return SettingsStore.appSettings.unit === "metric"
      ? "£ per Kg"
      : "£ per unit";
  }
}
