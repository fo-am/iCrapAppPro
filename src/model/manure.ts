import { Maths } from "../assets/Math";

export default class Manure {
    public key: string;
    public name: string = "";
    public N: number | undefined;
    public P: number | undefined;
    public K: number | undefined;

    constructor() {
        this.key = Maths.generateUUID();
    }
}
