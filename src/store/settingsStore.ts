import { observable } from "mobx";
import store from "react-native-simple-store";

class SettingsStore {
  @observable public unit: string;
  @observable public rainfall: string;

  constructor() {
    store.get("settings").then(res => {
      res.Unit ? (this.unit = res.Unit) : (this.unit = "metric");
      res.Rainfall
        ? (this.rainfall = res.Rainfall)
        : (this.rainfall = "rain-medium");
    });
  }
  // metric/imperial
  // cost of nutrients
  // rainfall? (per farm!)

  public SelectUnit(item) {
    this.unit = item;
    store.update("settings", {
      Unit: item
    });
  }
  public SelectRainfall(item) {
    this.rainfall = item;
    store.update("settings", {
      Rainfall: item
    });
  }
}
export default new SettingsStore();
