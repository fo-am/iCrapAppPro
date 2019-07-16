import { observable } from "mobx";

export default class AppSettings {
    @observable public unit: string;
    @observable public email: string;
    public appVersion: string;
    public fileVersion: number;
    @observable public backupSchedule: string;

    constructor() {
        this.unit = "metric";
        this.email = "not@set";
        this.appVersion = "iOS 1.0 Beta 38";
        this.fileVersion = 1;
        this.backupSchedule = "never";
    }
}
