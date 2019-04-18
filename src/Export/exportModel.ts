import moment, { Moment } from "moment";
import { Maths } from "../assets/Math";
import Coords from "../model/Coords";
import LatLng from "../model/LatLng";

class ExportFarm {
    public key: string;
    public farmLocation: LatLng = new LatLng();
    public name: string = "Your Farm";
    public fields: Array<ExportField> = Array<ExportField>();
    public rainfall: string = "rain-low";
    public costN: number = 0.79;
    public costP: number = 0.62;
    public costK: number = 0.49;
    public costS: number = 0;
    public costMg: number = 0;
    constructor() {
        this.key = Maths.generateUUID();
    }
}

class ExportField {
    public farmKey: string = "Farm";
    public key: string;
    public fieldCoordinates: Coords = new Coords();
    public area: number = 0;
    public name = "Your Field";
    public spreadingEvents: Array<ExportSpread> = Array<ExportSpread>();
    public soilType: string = "sandyshallow";
    public organicManure: string = "no";
    public soilTestP: string = "soil-p-0";
    public soilTestK: string = "soil-k-0";
    public soilTestMg: string = "soil-m-0";
    public prevCropType: string = "cereals";
    public recentGrass: string = "no";
    public cropType: Array<Array<string>> = [["crop", "maize"]];
}
class ExportSpread {
    public key: string = Maths.generateUUID();
    public fieldkey: string = "";
    public manureType: string = "";
    public date: Moment;
    public quality: string = "";
    public applicationType: string = "";
    public amount: number = 0;
    public nutrientsN: number = 0;
    public nutrientsP: number = 0;
    public nutrientsK: number = 0;
    public requireN: number = 0;
    public requireP: number = 0;
    public requireK: number = 0;
    public sns: number = 0;
    public soil: string = "";
    public size: number = 0;
    public season: string = "";
    public crop: string = "";
}

export { ExportFarm, ExportField, ExportSpread };
