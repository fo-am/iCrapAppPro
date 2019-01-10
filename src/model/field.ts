import { observable } from "mobx";
import Coords from "../model/Coords";
import Spread from "../model/spread";

export default class Field {
  @observable public key: string;
  @observable public fieldCoordinates: Coords = new Coords();
  @observable public area: number = 0;
  @observable public name = "New Field";
  public readonly spreadingEvents = observable<Spread>([]);
  @observable public soilType: string = "";
  @observable public organicManure: string = "no";
  @observable public soilTestP: number = 0;
  @observable public soilTestK: number = 0;
  @observable public prevCropType: string = "cereal";
  @observable public recentGrass: string = "no";
  @observable public cropType: string = "";

  constructor() {
    this.key = this.generateUUID();
  }
  private generateUUID() {
    let d = Date.now();

    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function(c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
}
