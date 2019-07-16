import { action, autorun, computed, observable, toJS } from "mobx";
import moment, { Moment } from "moment";
import { database } from "../database/Database";
import Farm from "../model/Farm";

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
    @observable public refresh: number = 0;

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

    public async SetBackupTime(): Promise<void> {
        return database.SetBackupTimeForFarm(this.farm.key, moment());
    }

    public UpdateLocation(): Region {
        if (this.farm.farmLocation) {
            if (this.farm.farmLocation.latitude) {
                return {
                    latitude: this.farm.farmLocation.latitude,
                    longitude: this.farm.farmLocation.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008
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
    public async deleteFarm(): Promise<void> {
        return database.deleteFarm(this.farm.key).then(() => this.getFarms());
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
    public SetSCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.farm.costS = item;
    }
    public SetMgCost(item: string) {
        if (!item) {
            item = "0";
        }
        this.farm.costMg = item;
    }
}
export default new FarmStore();
