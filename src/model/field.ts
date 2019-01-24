import { observable } from "mobx";
import { Maths } from "../assets/Math";
import Coords from "../model/Coords";
import Spread from "../model/spreadEvent";

export default class Field {
  @observable public key: string;
  @observable public fieldCoordinates: Coords = new Coords();
  @observable public area: number = 0;
  @observable public name = "New Field";
  @observable public spreadingEvents = Array<Spread>();
  @observable public soilType: string = "";
  @observable public organicManure: string = "no";
  @observable public soilTestP: number = 0;
  @observable public soilTestK: number = 0;
  @observable public prevCropType: string = "cereal";
  @observable public recentGrass: string = "no";
  @observable public cropType: string = "";

  constructor() {
    this.key = Maths.generateUUID();
  }
}
