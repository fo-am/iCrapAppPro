import { observable } from "mobx";
import store from "react-native-simple-store";
import Manure from "../model/manure";

import { database } from "../database/Database";

class ManureStore {
    @observable public manures: Array<Manure> = new Array<Manure>();
    @observable public manure: Manure = new Manure();

    constructor() {
        this.updateManuresList();
    }

    public saveManure() {
        const newManure = this.manure;

        if (!newManure.name) {
            newManure.name = "New Manure";
        }
        if (!newManure.N) {
            newManure.N = 0;
        }
        if (!newManure.P) {
            newManure.P = 0;
        }
        if (!newManure.K) {
            newManure.K = 0;
        }
        database.saveManure(newManure).then(() => this.updateManuresList());
    }

    public getManures(): Array<Manure> {
        return this.manures.slice();
    }

    public deleteManure() {
        database
            .deleteManure(this.manure)
            .then(() => (this.manure = new Manure()))
            .then(() => this.updateManuresList());
    }

    public getManure(key: string) {
        return database.getManure(key).then(res => (this.manure = res));
    }
    private updateManuresList() {
        database.getManures().then(res => (this.manures = res));
    }
}
export default new ManureStore();
