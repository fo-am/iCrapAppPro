import { observable } from "mobx";

export default class SliderValues {
    @observable public sliderStartValue: number | undefined;
    @observable public sliderMaxValue: number | undefined;
    @observable public sliderUnit: string | undefined;
}
