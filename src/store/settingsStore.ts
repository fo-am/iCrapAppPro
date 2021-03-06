import { observable } from "mobx";
import { database } from "../database/Database";
import AppSettings from "../model/appSettings";

class SettingsStore {
    @observable public appSettings: AppSettings = new AppSettings();

    constructor() {
        this.getSettings();
    }

    public SelectUnit(item) {
        this.appSettings.unit = item;
    }
    public ChangeBackupSchedule(item) {
        this.appSettings.backupSchedule = item;
    }

    public getSettings() {
        database.getAppSettings().then(res => {
            this.appSettings.unit = res.unit;
            this.appSettings.email = res.email;
            this.appSettings.backupSchedule = res.backupSchedule;
        });
    }

    public async SaveSettings(): Promise<void> {
        if (this.appSettings.email === undefined) {
            this.appSettings.email = "Not@Set";
        }
        if (this.appSettings.unit === undefined) {
            this.appSettings.unit = "metric";
        }
        if (this.appSettings.backupSchedule === undefined) {
            this.appSettings.backupSchedule = "never";
        }
        return database.saveAppSettings(this.appSettings);
    }
}
export default new SettingsStore();
