import { action, computed, isObservableObject, observable, toJS } from "mobx";
import { LatLng } from "react-native-maps";
import store from "react-native-simple-store";
import Coords from "../model/Coords";
import Field from "../model/field";
import SpreadEvent from "../model/spreadEvent";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

class FieldStore {
  @observable public field: Field;
  @observable public fields: Array<Field> = new Array<Field>();
  //    @observable public region: Region = undefined;
  @observable public initalRegion: Region;
  @observable public newField: Coords = new Coords();

  @observable public newSpreadEvent: SpreadEvent = new SpreadEvent();

  constructor() {
    this.field = new Field();
    this.getFields();
    this.initalRegion = {
      latitude: 50.184363,
      longitude: -5.173699,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    };
  }
  public reset() {
    this.field = new Field();
    this.getFields();
  }

  @action public SetFieldArea(area: number) {
    this.field.area = area;
  }

  public SetCoordinates(coords: any) {
    this.field.fieldCoordinates.id = coords.id;
    this.field.fieldCoordinates.coordinates.length = 0;

    coords.coordinates.forEach(element => {
      this.field.fieldCoordinates.coordinates.push(element);
    });
  }

  @computed public get DataSource(): Array<LatLng> {
    return this.field.fieldCoordinates.coordinates.slice();
  }

  public Save() {
    const idx = this.fields.findIndex(n => this.field.key === n.key);
    if (idx < 0) {
      this.fields.push(this.field);
    } else {
      this.fields[idx] = this.field;
    }

    store.save("fields", this.fields);
    this.getFields();
  }

  public SetField(key: string) {
    const idx = this.fields.findIndex(n => key === n.key);
    if (idx < 0) {
    } else {
      this.field = this.fields[idx];
    }
  }

  public UpdateLocation(): Region {
    // calculate rect
    if (this.field.fieldCoordinates) {
      if (this.field.fieldCoordinates.coordinates.length > 0) {
        const a = this.field.fieldCoordinates.coordinates[0];
        let minX: number = a.latitude,
          maxX: number = a.latitude,
          minY: number = a.longitude,
          maxY: number = a.longitude;
        this.field.fieldCoordinates.coordinates.slice().map(point => {
          minX = Math.min(minX, point.latitude);
          maxX = Math.max(maxX, point.latitude);
          minY = Math.min(minY, point.longitude);
          maxY = Math.max(maxY, point.longitude);
        });

        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        const deltaX = (maxX - minX) * 1.2;
        const deltaY = (maxY - minY) * 1.2;
        if (minX) {
          return {
            latitude: midX,
            longitude: midY,
            latitudeDelta: deltaX,
            longitudeDelta: deltaY
          };
        }
      } else {
        return {
          latitude: 50.184363,
          longitude: -5.173699,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        };
      }
    }
  }

  @action public ClearStore() {
    this.fields = [];
    store.save("fields", this.fields);
  }

  private getFields() {
    store
      .get("fields")
      .then((res: Array<Field> | undefined) => {
        if (res instanceof Array) {
          return res;
        } else {
          return [];
        }
      })
      .then(res => (this.fields = res));
  }
}
export default new FieldStore();
