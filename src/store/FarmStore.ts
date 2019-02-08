import { action, autorun, computed, observable, toJS } from "mobx";
import Farm from "../model/Farm";
import FieldStore from "./FieldsStore";

interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

class FarmStore {
    public initalRegion: Region;

    @observable public farm: Farm = new Farm();
    constructor() {
        this.initalRegion = {
            latitude: 50.184363,
            longitude: -5.173699,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };
    }
}
