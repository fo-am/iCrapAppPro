import { observable } from "mobx";
import Manure from "../model/manure";

class ManureStore {
    @observable public manures: Array<Manure> = new Array<Manure>();

    public saveManure(manure: Manure) {
        const idx = this.manures.findIndex(n => manure.key === n.key);
        if (idx < 0) {
            this.manures.push(manure);
        } else {
            this.manures[idx] = manure;
        }
    }

    public getManures(): Array<Manure> {
        return this.manures.slice();
    }

    public deleteManure(manure: Manure) {
        const idx = this.manures.findIndex(n => n.key === manure.key);
        if (idx < 0) {
            throw new Error(`Note ${manure.name} not found`);
        } else {
            this.manures.splice(idx, 1);
        }
    }

    public getManure(key: string): Manure {
        const idx = this.manures.findIndex(n => n.key === key);
        if (idx < 0) {
            throw new Error(`Manure ${key} ${name} not found`);
        } else {
            return this.manures[idx];
        }
    }
}
export default ManureStore;
