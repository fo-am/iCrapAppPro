import { observable } from "mobx";

export default class Farm {
    @observable public unit: string = "metric";
    @observable public email: string = "not@set";
}
