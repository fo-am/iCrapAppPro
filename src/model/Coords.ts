import { observable } from "mobx";
import LatLng from "./LatLng";

export default class Coords {
  @observable public id: string = "";
  public readonly coordinates = observable<LatLng>([]);
}
