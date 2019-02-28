import { observable } from "mobx";
import moment, { Moment } from "moment";
import { Maths } from "../assets/Math";

export default class SpreadEvent {
    @observable public key: string = Maths.generateUUID();
    @observable public fieldkey: string = "";
    @observable public manureType: string = "";
    @observable public date: Moment;
    @observable public quality: string = "";
    @observable public applicationType: string = "";
    @observable public amount: number = 0;
    @observable public nutrientsN: number = 0;
    @observable public nutrientsP: number = 0;
    @observable public nutrientsK: number = 0;
    @observable public requireN: number = 0;
    @observable public requireP: number = 0;
    @observable public requireK: number = 0;
    @observable public sns: number = 0;
    @observable public soil: string = "";
    @observable public size: number = 0;
    @observable public season: string = "";
    @observable public crop: string = "";

    // copy numbers from field and fix calculated values.
    constructor() {
        this.date = moment();
    }
}
