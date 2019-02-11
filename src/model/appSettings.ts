import { observable } from "mobx";

export default class AppSettings {
    @observable public unit: string;
    @observable public email: string;

    constructor() {
        this.unit = "metric";
        this.email = "not@set";
    }
}
