import { observable } from "mobx";

export default class CalculatorValues {
    @observable public sliderValue: number;
    @observable public manureSelected: number;
    @observable public applicationSelected: number;
    @observable public soilSelected: number;
    @observable public cropSelected: number;
    @observable public seasonSelected: number;
    @observable public qualitySelected: number;

    public ToString() {
        return `sliderValue: ${this.sliderValue}
        manureSelected:  ${this.manureSelected}
        applicationSelected:  ${this.applicationSelected}
        soilSelected:  ${this.soilSelected}
        cropSelected:  ${this.cropSelected}
        seasonSelected:  ${this.seasonSelected}
        qualitySelected:  ${this.qualitySelected}`;
    }
}
