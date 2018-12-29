import { observable } from "mobx";

class SettingsStore {
    @observable public units!: number;
    constructor() {}
    // metric/imperial
    // cost of nutrients
    // rainfall? (per farm!)
}
export default new SettingsStore();
