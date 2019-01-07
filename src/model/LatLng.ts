import { observable } from "mobx";

export default class LatLng {
    @observable public latitude: number;
    @observable public longitude: number;
}
