import { observable } from "mobx";
import { Maths } from "../assets/Math";
import Coords from "../model/Coords";
import LatLng from "../model/LatLng";

export default class Farm {
    @observable public key: string;
    @observable public farmLocation: Coords = new Coords();
    @observable public area: number = 0;
    @observable public name = "New Field";
    @observable public spreadingEvents = Array<Spread>();
    @observable public soilType: string = "sandyshallow";
    @observable public organicManure: string = "no";
    @observable public soilTestP: number = 0;
    @observable public soilTestK: number = 0;
    @observable public prevCropType: string = "cereals";
    @observable public recentGrass: string = "no";
    @observable public cropType: string = "winter-wheat-incorporated-feed";

    constructor() {
        this.key = Maths.generateUUID();
    }
}
