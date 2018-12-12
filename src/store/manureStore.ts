import { observable } from "mobx";
import store from "react-native-simple-store";
import Manure from "../model/manure";

class ManureStore {
  @observable public manures: Array<Manure> = new Array<Manure>();
  constructor(props) {
    store
      .get("customManure")
      .then(res => {
        if (res instanceof Array) {
          return res;
        } else {
          return [];
        }
      })
      .then(res => (this.manures = res));
  }
  public saveManure(manure: Manure) {
    // get all from store

    const newManure = manure;

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

    const idx = this.manures.findIndex(n => manure.key === n.key);
    if (idx < 0) {
      this.manures.push(manure);
    } else {
      this.manures[idx] = manure;
    }
    store.save("customManure", this.manures);
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
    store.save("customManure", this.manures);
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
