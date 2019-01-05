import { observable } from "mobx";
import { Polygon } from "react-native-maps";
import Spread from "../model/spread";

export default class Field {
  @observable public fieldCoordinates: Polygon = new Polygon();
  @observable public area = 0;
  @observable public name = "New Field";
  @observable public spreadingEvents: Array<Spread> = new Array<Spread>();
  @observable public soilType: string;
  @observable public organicManure: string = "No";
  @observable public soilTestP: number = 0;
  @observable public soilTestK: number = 0;
  @observable public prevCropType: string;
  @observable public recentGrass: string = "No";
  @observable public cropType: string;
}
