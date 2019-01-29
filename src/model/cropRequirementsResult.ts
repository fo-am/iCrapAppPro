import { observable } from "mobx";

export default class CropRequirementsResult {
    @observable public nitrogenRequirement: number = 0;
    @observable public phosphorousRequirement: number = 0;
    @observable public potassiumRequirement: number = 0;
    @observable public nitrogenSupply: number = 0;
}
