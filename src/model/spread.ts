import { observable } from "mobx";

export default class SpreadEvent {
  @observable public manureType: string = "";
  @observable public date: number = Date.now();
  @observable public quality: string = "";
  @observable public applicationType: string = "";
  @observable public ammount: number = 0;
  // copy numbers from field and fix calculated values.
}
