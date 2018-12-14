import { observable } from "mobx";
import store from "react-native-simple-store";
import CalculatorValues from "../model/CalculatorValues";
import Manure from "../model/manure";

class CalculatorStore {
  @observable public calculatorValues = new CalculatorValues();
  constructor() {}

  public getPotassium(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}
export default new CalculatorStore();
// https://mobx.js.org/best/store.html
//
// https://github.com/gothinkster/react-mobx-realworld-example-app/tree/master/src/stores
