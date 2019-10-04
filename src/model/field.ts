import { observable } from "mobx";
import { Maths } from "../assets/Math";
import Coords from "../model/Coords";
import Spread from "../model/spreadEvent";
import LatLng from "./LatLng";

export default class Field {
    @observable public farmKey: string = "Farm";
    @observable public key: string;
    @observable public fieldCoordinates: Coords = new Coords();
    @observable public area: number = 0;
    @observable public name = "Your Field";
    @observable public spreadingEvents: Array<Spread> = new Array<Spread>();
    @observable public soilType: string = "sandyshallow";
    @observable public organicManure: string = "no";
    @observable public soilTestP: string = "soil-p-0";
    @observable public soilTestK: string = "soil-k-0";
    @observable public soilTestMg: string = "soil-m-0";
    @observable public prevCropType: string = "cereals";
    @observable public recentGrass: string = "no";
    @observable public cropType: Array<Array<string>> = [["crop", "maize"]];
    public deleted: number = 0;

    constructor(farmKey?: string) {
        this.key = Maths.generateUUID();
        if (farmKey) {
            this.farmKey = farmKey;
        }
    }
    public centre(): LatLng {
        const a = this.fieldCoordinates.coordinates.reduce(
            (acc, curr) => {
                acc.minLat = Math.min(acc.minLat, curr.latitude);
                acc.maxLat = Math.max(acc.maxLat, curr.latitude);
                acc.minLon = Math.min(acc.minLon, curr.longitude);
                acc.maxLon = Math.max(acc.maxLon, curr.longitude);

                return acc;
            },
            { minLat: 90, maxLat: -90, minLon: 180, maxLon: -180 }
        );
        const midLat = (a.minLat + a.maxLat) / 2;
        const midLon = (a.minLon + a.maxLon) / 2;
        const ret = new LatLng();
        ret.latitude = midLat;
        ret.longitude = midLon;

        return ret;
    }
}
