export abstract class Maths {
    public static generateUUID(): string {
        let d = Date.now();

        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function(c) {
                const r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
        return uuid;
    }
    public static Round(value: number, places: number): number {
        return +(Math.round(value + "e+" + places) + "e-" + places);
    }
}
