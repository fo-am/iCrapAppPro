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
    @observable public nutrientsS: number = 0;
    @observable public nutrientsMg: number = 0;
    @observable public totalNutrientsN: number = 0;
    @observable public totalNutrientsP: number = 0;
    @observable public totalNutrientsK: number = 0;
    @observable public totalNutrientsS: number = 0;
    @observable public totalNutrientsMg: number = 0;
    @observable public requireN: number = 0;
    @observable public requireP: number = 0;
    @observable public requireK: number = 0;
    @observable public requireS: number = 0;
    @observable public requireMg: number = 0;
    @observable public sns: number = 0;
    @observable public soil: string = "";
    @observable public size: number = 0;
    @observable public season: string = "";
    @observable public crop: string[][] = [];
    @observable public imagePath: string = "";
    public deleted: number = 0;

    // copy numbers from field and fix calculated values.
    constructor() {
        this.date = moment();
    }
}
