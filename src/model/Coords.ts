import { observable } from "mobx";
import LatLng from "./LatLng";

export default class Coords {
    public id: string;
    public coordinates: Array<LatLng>;
}
