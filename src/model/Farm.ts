import { observable } from "mobx";
import moment, { Moment } from "moment";
import { Maths } from "../assets/Math";
import LatLng from "../model/LatLng";
import Field from "./field";

export default class Farm {
    @observable public key: string;
    @observable public farmLocation: LatLng = new LatLng();

    @observable public name: string = "Your Farm";
    @observable public fields: Array<Field> = new Array<Field>();

    @observable public rainfall: string = "rain-low";
    @observable public costN: number = 0.79;
    @observable public costP: number = 0.62;
    @observable public costK: number = 0.49;
    @observable public costS: number = 0.49;
    @observable public costMg: number = 0.49;

    @observable public lastBackup: Moment = moment();
    public deleted: number = 0;

    constructor() {
        this.key = Maths.generateUUID();
    }
}
