import { action, autorun, computed, observable, toJS } from "mobx";
import Farm from "../model/Farm";
import FieldStore from "./FieldsStore";

import Marker, { MarkerProps } from "react-native-maps";

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

        this.farm = new Farm();
        this.getFarms();
    }
    public UpdateLocation(): Region {
        if (this.farm.farmLocation) {
            if (this.farm.farmLocation.latitude) {
                return {
                    latitude: this.farm.farmLocation.latitude,
                    longitude: this.farm.farmLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                };
            }
        }

        return this.initalRegion;
    }
    public getFarms() {
        database.getFarms().then(res => (this.farms = res));
    }
    public async saveFarm(): Promise<void> {
        return database.saveFarm(this.farm).then(() => this.getFarms());
    }
    public reset() {
        this.farm = new Farm();
    }
    public SetFarm(key: string) {
        database.getFarm(key).then(res => (this.farm = res));
    }
    public SelectRainfall(item) {
        this.farm.rainfall = item;
    }

    public SetNCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.farm.costN = item;
    }
    public SetPCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.farm.costP = item;
    }
    public SetKCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.farm.costK = item;
    }
}
export default new FarmStore();
