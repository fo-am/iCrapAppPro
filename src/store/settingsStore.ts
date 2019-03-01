import { observable } from "mobx";
import { database } from "../database/Database";
import appSettings from "../model/appSettings";

class SettingsStore {
    @observable public appSettings: appSettings = new appSettings();

    @observable public rainfall: string = "rain-medium";

    constructor() {
        this.getSettings();
    }

    public SelectUnit(item) {
        this.appSettings.unit = item;
    }

    public getSettings() {
        database.getAppSettings().then(res => {
            this.appSettings.unit = res.unit;
            this.appSettings.email = res.email;
        });
    }

    public async SaveSettings(): Promise<void> {
        if (this.appSettings.email === undefined) {
            this.appSettings.email = "Not@Set";
        }
        if (this.appSettings.unit === undefined) {
            this.appSettings.unit = "metric";
        }
        return database.saveAppSettings(this.appSettings);
    }
}
export default new SettingsStore();
