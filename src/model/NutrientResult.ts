import { observable } from "mobx";

export default class NutrientResult {
    @observable public nitrogenAvailable: number = 0;
    @observable public nitrogenTotal: number = 0;
    @observable public potassiumAvailable: number = 0;
    @observable public potassiumTotal: number = 0;
    @observable public phosphorousAvailable: number = 0;
    @observable public phosphorousTotal: number = 0;

    @observable public sulphurAvailable: number = 0;
    @observable public sulphurTotal: number = 0;

    @observable public magnesiumAvailable: number = 0;
    @observable public magnesiumTotal: number = 0;
}
