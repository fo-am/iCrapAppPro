import { action, autorun, computed, observable, toJS } from "mobx";
import { LatLng } from "react-native-maps";

import Coords from "../model/Coords";
import CropRequirementsResult from "../model/cropRequirementsResult";
import Farm from "../model/Farm";
import Field from "../model/field";
import SpreadEvent from "../model/spreadEvent";

import CalculatorStore from "../store/calculatorStore";

import { database } from "../database/Database";

interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

class FieldStore {
    @observable public field: Field;
    @observable public fields: Array<Field> = new Array<Field>();
    @observable public initalRegion: Region;
    @observable public newField: Coords = new Coords();

    @observable public farm: Farm = new Farm();

    @observable public newSpreadEvent: SpreadEvent = new SpreadEvent();
    @observable public spreadEvents: Array<SpreadEvent> = new Array<
        SpreadEvent
    >();
    @observable
    public cropRequirementsResult: CropRequirementsResult = new CropRequirementsResult();

    constructor() {
        this.field = new Field();
        this.initalRegion = {
            latitude: 50.184363,
            longitude: -5.173699,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };
        const disposer = autorun(() => this.CalcCropRequirements(), {
            delay: 50
        });
    }
    public reset(farmKey: string) {
        this.field = new Field(farmKey);
        this.getSpreadEvents(this.field.key);
        this.getFields(farmKey);
    }

    public async SetField(fieldKey: string): Promise<void> {
        return database.getField(fieldKey).then(field => {
            this.field = field;
            this.getSpreadEvents(field.key);
            this.getFields(field.farmKey);
            //  this.getFarm(field.farmKey);
        });
    }

    @action public SetFieldArea(area: number) {
        this.field.area = area;
    }

    public SetCoordinates(coords: any) {
        this.field.fieldCoordinates.id = coords.id;
        this.field.fieldCoordinates.coordinates.clear();

        this.field.fieldCoordinates.coordinates.replace(coords.coordinates);
    }

    @computed public get DataSource(): Array<LatLng> {
        return this.field.fieldCoordinates.coordinates.slice();
    }

    public async Save(): Promise<void> {
        return database
            .saveField(this.field)
            .then(() => this.getFields(this.field.farmKey));
    }

    public SaveSpreadEvent() {
        // spread key pre set
        this.newSpreadEvent.fieldkey = this.field.key;
        this.newSpreadEvent.manureType =
            CalculatorStore.calculatorValues.manureSelected;
        // Date pre set
        this.newSpreadEvent.quality =
            CalculatorStore.calculatorValues.qualitySelected;
        this.newSpreadEvent.applicationType =
            CalculatorStore.calculatorValues.applicationSelected;
        this.newSpreadEvent.amount =
            CalculatorStore.calculatorValues.sliderValue;
        this.newSpreadEvent.nutrientsN =
            CalculatorStore.nutrientResults.nitrogenAvailable;
        this.newSpreadEvent.nutrientsP =
            CalculatorStore.nutrientResults.phosphorousAvailable;
        this.newSpreadEvent.nutrientsK =
            CalculatorStore.nutrientResults.potassiumAvailable;
        this.newSpreadEvent.requireN = this.cropRequirementsResult.nitrogenRequirement;
        this.newSpreadEvent.requireP = this.cropRequirementsResult.phosphorousRequirement;
        this.newSpreadEvent.requireK = this.cropRequirementsResult.potassiumRequirement;
        this.newSpreadEvent.sns = this.cropRequirementsResult.nitrogenSupply;
        this.newSpreadEvent.soil = this.field.soilType;
        this.newSpreadEvent.size = this.field.area;
        // season pre set
        this.newSpreadEvent.crop = this.field.cropType;

        database
            .saveSpreadEvent(this.newSpreadEvent)
            .then(() => this.getSpreadEvents(this.field.key));
    }

    public async SetSpread(spreadKey: string): Promise<void> {
        return database
            .getSpreadEvent(spreadKey)
            .then(res => {
                this.newSpreadEvent = res;
                // set the items in the spread event.
                CalculatorStore.calculatorValues.manureSelected =
                    res.manureType;
                CalculatorStore.calculatorValues.qualitySelected = res.quality;
                CalculatorStore.calculatorValues.applicationSelected =
                    res.applicationType;
                CalculatorStore.calculatorValues.sliderValue = res.amount;
                CalculatorStore.nutrientResults.nitrogenAvailable =
                    res.nutrientsN;
                CalculatorStore.nutrientResults.phosphorousAvailable =
                    res.nutrientsP;
                CalculatorStore.nutrientResults.potassiumAvailable =
                    res.nutrientsK;
                this.cropRequirementsResult.nitrogenRequirement = res.requireN;
                this.cropRequirementsResult.phosphorousRequirement =
                    res.requireP;
                this.cropRequirementsResult.potassiumRequirement = res.requireK;
                this.cropRequirementsResult.nitrogenSupply = res.sns;
            })
            .then(() => this.getSpreadEvents(this.newSpreadEvent.fieldkey));
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
            } else if (this.farm.farmLocation) {
                return {
                    latitude: this.farm.farmLocation.latitude,
                    longitude: this.farm.farmLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                };
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
    public CalcCropRequirements() {
        this.cropRequirementsResult = CalculatorStore.getCropRequirementsSupplyFromField(
            this.field,
            this.CalculateSulphurRisk()
        );
    }
    public CalculateSulphurRisk() {
        // rainfall
        const rain = this.farm.rainfall;
        // soil type
        const soiltype = this.field.soilType;

        // ;; All light sand and shallow soils = High risk
        // ;; Medium soils with low rainfall = Low risk
        // ;; Medium soils with medium or high rainfall = High risk
        // ;; Deep clay, deep silt, organic and peat soils with low or medium rainfall = Low risk
        // ;; Deep clay, deep silt, organic and peat soils with high rainfall = High risk

        if (soiltype == "sandyshallow" || soiltype === "mediumshallow") {
            return "high";
        }

        if (soiltype === "medium") {
            if (rain === "rain-low") {
                return "low";
            } else {
                return "high";
            }
        }

        if (rain === "rain-high") {
            return "high";
        }
        return "low";
    }
    private getFarm(farmKey: string) {
        database.getFarm(farmKey).then((farm: Farm) => (this.farm = farm));
    }

    private getSpreadEvents(fieldKey: string) {
        database
            .getSpreadEvents(fieldKey)
            .then(res => (this.spreadEvents = res));
    }

    private getFields(farmKey: string) {
        database.getFields(farmKey).then((res: Field[]) => (this.fields = res));
    }
}
export default new FieldStore();
