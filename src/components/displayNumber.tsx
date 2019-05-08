import { inject, observer } from "mobx-react/native";
import { Text } from "native-base";
import React, { Component } from "react";
import { Maths } from "../assets/Math";
import styles from "../styles/style";

interface Props {
  value: number;
  units?: string;
}

interface State {}

@inject("SettingsStore")
@observer
export default class FormatValue extends Component<Props, State> {
  public render() {
    const { SettingsStore, units } = this.props;
    const metricValue = this.props.value;

    let finalVal = metricValue;

    if (units) {
      if (SettingsStore.appSettings.unit !== "metric") {
        // switch on the unit we want to display!
        switch (units) {
          case "gallons/acre":
            finalVal = this.metresCubedHectareToGallonsAcre(metricValue);
            break;
          case "tons/acre":
            finalVal = this.tonsHectareToTonsAcre(metricValue);
            break;
          case "UnitsAcre":
            finalVal = this.kilogramHectareToUnitsAcre(metricValue);
            break;
          case "acres":
            finalVal = this.hectaresToAcres(metricValue);
            break;

          default:
          // code block
        }
      }
    }

    return <Text style={styles.text}>{this.Round(finalVal)}</Text>;
  }

  private Round(value: number): string {
    if (isNaN(value)) {
      return "N/A";
    } else {
      return String(Maths.Round(value, 2));
    }
  }

  private metricTonToImperialTon(metricTon) {
    return metricTon * 0.984207;
  }

  private tonsHectareToTonsAcre(tonsHectare) {
    return tonsHectare / 2.4710538146717;
  }
  private metresCubedHectareToGallonsAcre(metresCubedHectare) {
    return metresCubedHectare / 0.0112336377;
  }

  private kilogramHectareToUnitsAcre(kilogramHectare) {
    return kilogramHectare * 0.8;
  }

  private hectaresToAcres(hectares) {
    return hectares * 2.4710538146717;
  }
  private AcresToHectares(acres) {
    return acres * 0.404686;
  }
}
