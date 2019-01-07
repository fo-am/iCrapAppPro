import { observable } from "mobx";
import LatLng from "./LatLng";

export default class Coords {
    @observable public id: string;
    @observable public coordinates: Array<LatLng>;
}
