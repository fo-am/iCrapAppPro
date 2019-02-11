import { action, autorun, computed, observable, toJS } from "mobx";
import Farm from "../model/Farm";
import FieldStore from "./FieldsStore";

import { database } from "../database/Database";

interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

class FarmStore {
    public initalRegion: Region;

    @observable public farm: Farm = new Farm();
    @observable public farms: Array<Farm> = new Array<Farm>();
    constructor() {
        this.initalRegion = {
            latitude: 50.184363,
            longitude: -5.173699,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };
    }
    public UpdateLocation(): Region {
        return {
            latitude: 50.184363,
            longitude: -5.173699,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };
    }
    public saveFarm() {
        database.saveFarm(this.farm);
    }
}
export default new FarmStore();
