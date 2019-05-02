import { observable } from "mobx";
import { Maths } from "../assets/Math";

export default class Manure {
    @observable public key: string;
    @observable public name: string = "";
    @observable public N: number | undefined;
    @observable public P: number | undefined;
    @observable public K: number | undefined;
    @observable public S: number | undefined;
    @observable public Mg: number | undefined;
    @observable public Type: string = "custom-slurry-dm2";

    constructor() {
        this.key = Maths.generateUUID();
    }
}
