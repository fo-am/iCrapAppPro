import { observable } from "mobx";
import store from "react-native-simple-store";

class SettingsStore {
    @observable public unit: string;
    @observable public rainfall: string;

    @observable public NCost: string;
    @observable public PCost: string;
    @observable public KCost: string;

    constructor() {
        store
            .get("settings")
            .then(res => {
                if (res) {
                    this.unit = res.Unit;
                    this.rainfall = res.Rainfall;
                } else {
                    this.unit = "metric";
                    this.rainfall = "rain-medium";
                }
            })
            .then(() =>
                store.get("costs").then(res => {
                    if (res) {
                        this.NCost = res.nCost;
                        this.PCost = res.pCost;
                        this.KCost = res.kCost;
                    } else {
                        this.NCost = "0.79";
                        this.PCost = "0.62";
                        this.KCost = "0.49";
                    }
                })
            )
            .then(() =>
                store
                    .save("settings", {
                        Rainfall: this.rainfall
                    })
                    .then(() =>
                        store.save("settings", {
                            Unit: this.unit
                        })
                    )
                    .then(() =>
                        store.save("costs", {
                            kCost: this.KCost
                        })
                    )
                    .then(() =>
                        store.save("costs", {
                            pCost: this.PCost
                        })
                    )
                    .then(() =>
                        store.save("costs", {
                            nCost: this.NCost
                        })
                    )
            );
    }
    // metric/imperial
    // cost of nutrients
    // rainfall? (per farm!)

    public SelectUnit(item) {
        this.unit = item;
    }
    public SelectRainfall(item) {
        this.rainfall = item;
    }

    public SetNCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.NCost = item;
    }
    public SetPCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.PCost = item;
    }
    public SetKCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.KCost = item;
    }

    public SaveSettings() {
        store
            .update("settings", {
                Rainfall: this.rainfall
            })
            .then(() =>
                store.update("settings", {
                    Unit: this.unit
                })
            )
            .then(() =>
                store.update("costs", {
                    kCost: this.KCost
                })
            )
            .then(() =>
                store.update("costs", {
                    pCost: this.PCost
                })
            )
            .then(() =>
                store.update("costs", {
                    nCost: this.NCost
                })
            );
    }
}
export default new SettingsStore();
