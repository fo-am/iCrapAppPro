import { observable } from "mobx";
import store from "react-native-simple-store";

import appSettings from "../model/appSettings";

import { database } from "../database/Database";

class SettingsStore {
    @observable public appSettings: appSettings = new appSettings();

    @observable public rainfall: string = "rain-medium";
    @observable public NCost: string = "0.79";
    @observable public PCost: string = "0.62";
    @observable public KCost: string = "0.49";

    constructor() {
        this.getSettings();

        // store
        //     .get("settings")
        //     .then(res => {
        //         if (res) {
        //             this.unit = res.Unit;
        //             this.rainfall = res.Rainfall;
        //         } else {
        //             this.unit = "metric";
        //             this.rainfall = "rain-medium";
        //         }
        //     })
        //     .then(() =>
        //         store.get("costs").then(res => {
        //             if (res) {
        //                 this.NCost = res.nCost;
        //                 this.PCost = res.pCost;
        //                 this.KCost = res.kCost;
        //             } else {
        //                 this.NCost = "0.79";
        //                 this.PCost = "0.62";
        //                 this.KCost = "0.49";
        //             }
        //         })
        //     )
        //     .then(() =>
        //         store
        //             .save("settings", {
        //                 Rainfall: this.rainfall,
        //                 Unit: this.unit
        //             })
        //             .then(() =>
        //                 store.save("costs", {
        //                     kCost: this.KCost,
        //                     pCost: this.PCost,
        //                     nCost: this.NCost
        //                 })
        //             )
        //     );
    }
    // metric/imperial
    // cost of nutrients
    // rainfall? (per farm!)

    public SelectUnit(item) {
        this.appSettings.unit = item;
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

    public getSettings() {
        database.getAppSettings().then(res => {
            this.appSettings.unit = res.unit;
            this.appSettings.email = res.email;
        });
    }

    public SaveSettings(): Promise<void> {
        if (this.appSettings.email === undefined) {
            this.appSettings.email = "Not@Set";
        }
        if (this.appSettings.unit === undefined) {
            this.appSettings.unit = "metric";
        }
        return database.saveAppSettings(this.appSettings);

        // store.update("settings", {
        //     Rainfall: this.rainfall,
        //     Unit: this.unit
        // });

        // store.update("costs", {
        //     kCost: this.KCost,
        //     pCost: this.PCost,
        //     nCost: this.NCost
        // });
    }
}
export default new SettingsStore();
