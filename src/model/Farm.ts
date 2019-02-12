import { observable } from "mobx";
import { Maths } from "../assets/Math";
import Coords from "../model/Coords";
import LatLng from "../model/LatLng";
import Field from "./field";

export default class Farm {
    @observable public key: string;
    @observable public farmLocation: LatLng = new LatLng();

    @observable public name: string = "New Farm";
    @observable public fields: Array<Field> = Array<Field>();

    @observable public rainfall: string = "rain-low";
    @observable public costN: number = 0.79;
    @observable public costP: number = 0.62;
    @observable public costK: number = 0.49;

    constructor() {
        this.key = Maths.generateUUID();
    }
}
