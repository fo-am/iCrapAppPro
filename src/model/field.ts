import { observable } from "mobx";
import { Maths } from "../assets/Math";
import Coords from "../model/Coords";
import Spread from "../model/spreadEvent";

export default class Field {
    @observable public farmId: string = "Farm";
    @observable public key: string;
    @observable public fieldCoordinates: Coords = new Coords();
    @observable public area: number = 0;
    @observable public name = "New Field";
    @observable public spreadingEvents = Array<Spread>();
    @observable public soilType: string = "sandyshallow";
    @observable public organicManure: string = "no";
    @observable public soilTestP: string = "soil-p-0";
    @observable public soilTestK: string = "soil-k-0";
    @observable public prevCropType: string = "cereals";
    @observable public recentGrass: string = "no";
    @observable public cropType: string = "winter-wheat-incorporated-feed";

    constructor() {
        this.key = Maths.generateUUID();
    }
}
