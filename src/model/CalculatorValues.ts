import { observable } from "mobx";

export default class CalculatorValues {
    @observable public sliderValue: number;
    @observable public manureSelected: string;
    @observable public applicationSelected: string;
    @observable public soilSelected: number;
    @observable public cropSelected: number;
    @observable public seasonSelected: number;
    @observable public qualitySelected: string;
    @observable public soilTestP: number = 0;
    @observable public soilTestK: number = 0;

    public ToString() {
        return `sliderValue: ${this.sliderValue}
        manureSelected:  ${this.manureSelected}
        applicationSelected:  ${this.applicationSelected}
        soilSelected:  ${this.soilSelected}
        cropSelected:  ${this.cropSelected}
        seasonSelected:  ${this.seasonSelected}
        qualitySelected:  ${this.qualitySelected}
        soilTestP:   ${this.soilTestP}
        soilTestK:  ${this.soilTestK}`;
    }
}
