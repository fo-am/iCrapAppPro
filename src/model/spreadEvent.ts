import { observable } from "mobx";
import moment from "moment";
import { Maths } from "../assets/Math";

export default class SpreadEvent {
  @observable public key: string = Maths.generateUUID();
  @observable public manureType: string = "";
  @observable public date: string;
  @observable public quality: string = "";
  @observable public applicationType: string = "";
  @observable public amount: number = 0;
  // copy numbers from field and fix calculated values.
  constructor() {
    this.date = moment(Date.now())
      .locale("en-gb")
      .format("L");
  }
}
