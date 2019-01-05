import { observable } from "mobx";
import store from "react-native-simple-store";
import Field from "../model/field";

class FieldStore {
  @observable public fileds: Array<Field> = new Array<Field>();
  // Get all field names (and ids so we can make buttons)
  // get details of a field (by id or name?)
  // save a field
  // delete a field (by id?)

  constructor() {
    store
      .get("fields")
      .then((res: Array<Field> | undefined) => {
        if (res instanceof Array) {
          return res;
        } else {
          return [];
        }
      })
      .then(res => (this.fileds = res));
  }
}
export default new FieldStore();
