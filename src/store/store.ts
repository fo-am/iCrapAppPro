import { observable } from "mobx";
import Manure from "../model/manure";

class ManureStore {
  @observable private manures: Manure[] = [];

  public saveNote(manure: Manure) {
    const idx = this.manures.findIndex(n => manure.key === n.key);
    if (idx < 0) {
      this.manures.push(manure);
    } else {
      this.manures[idx] = manure;
    }
  }

  public deleteNote(manure: Manure) {
    const idx = this.manures.findIndex(n => n.key === manure.key);
    if (idx < 0) {
      throw new Error(`Note ${manure.name} not found`);
    } else {
      this.manures.splice(idx, 1);
    }
  }

  public getNote(key: string): Manure {
    const idx = this.manures.findIndex(n => n.key === key);
    if (idx < 0) {
      throw new Error(`Note ${key} not found`);
    } else {
      return this.manures[idx];
    }
  }
}

const observableManureStore = new ManureStore();

export default observableManureStore;
