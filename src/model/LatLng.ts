import { observable } from "mobx";

export default class LatLng {
  @observable public latitude: number = 0;
  @observable public longitude: number = 0;
}
