import { inject, observer } from "mobx-react/native";
import { Text } from "native-base";
import React, { Component } from "react";

interface Props {}

interface State {}

@inject("SettingsStore")
@observer
export default class DisplayAreaUnit extends Component<Props, State> {
  public render() {
    const { SettingsStore } = this.props;

    return (
      <Text>
        {SettingsStore.appSettings.unit === "metric" ? "Kg/ha" : "units/acre"}
      </Text>
    );
  }
}
