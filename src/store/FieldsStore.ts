import { action, computed, isObservableObject, observable, toJS } from "mobx";
import { LatLng } from "react-native-maps";
import store from "react-native-simple-store";
import Field from "../model/field";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

class FieldStore {
  @observable public field: Field;
  @observable public fields: Array<Field> = new Array<Field>();
  @observable public region: Region = undefined;
  @observable public initalRegion: Region;

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

  public get DataSource(): Array<LatLng> {
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

  public getLocation(): Region {
    const a = this.region;
    return a;
  }

  public UpdateLocation(): void {
    let minX: number, maxX: number, minY: number, maxY: number;

    // calculate rect
    if (this.field.fieldCoordinates) {
      this.field.fieldCoordinates.coordinates.map(point => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
      });

      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const deltaX = maxX - minX;
      const deltaY = maxY - minY;
      if (minX) {
        this.region = {
          latitude: midX,
          longitude: midY,
          latitudeDelta: deltaX,
          longitudeDelta: deltaY
        };
      } else {
        this.region = undefined;
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
