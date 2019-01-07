import { action, observable, toJS, computed, isObservableObject } from "mobx";
import { LatLng } from "react-native-maps";
import store from "react-native-simple-store";
import Field from "../model/field";

class FieldStore {
    @observable public field: Field;
    @observable public fields: Array<Field> = new Array<Field>();

    // Get all field names (and ids so we can make buttons)
    // get details of a field (by id or name?)
    // save a field
    // delete a field (by id?)

    constructor() {
        this.field = new Field();
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

    @action public SetFieldArea(area: number) {
        this.field.area = area;
    }

    @action public SetCoordinates(coords: any) {
        this.field.fieldCoordinates = coords;
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

        store.save("fields", toJS(this.fields));
    }

    public SetField(key: string) {
        const idx = this.fields.findIndex(n => key === n.key);
        if (idx < 0) {
        } else {
            this.field = this.fields[idx];
        }
    }

    @action public ClearStore() {
        this.fields = [];
        store.save("fields", this.fields);
    }
}
export default new FieldStore();
