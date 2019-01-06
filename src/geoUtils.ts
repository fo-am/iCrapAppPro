import { Component } from "react";

export default class SphericalUtil extends Component {
    constructor(props: any) {
        super(props);
    }
    public ToRadians(input: any) {
        return (input / 180) * Math.PI;
    }
    public PolarTriangleArea(tan1: any, lng1: any, tan2: any, lng2: any) {
        const deltaLng = lng1 - lng2;
        const t = tan1 * tan2;
        return (
            2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng))
        );
    }

    public ComputeSignedArea(path: any) {
        const radius = 6378137; // earth in meters
        const size = path.length;
        if (size < 3) {
            return 0;
        }
        let total = 0;
        const prev = path[size - 1];
        let prevTanLat = Math.tan(
            (Math.PI / 2 - this.ToRadians(prev.latitude)) / 2
        );
        let prevLng = this.ToRadians(prev.longitude);
        let index;
        for (index = 0; index < path.length; ++index) {
            const tanLat = Math.tan(
                (Math.PI / 2 - this.ToRadians(path[index].latitude)) / 2
            );
            const lng = this.ToRadians(path[index].longitude);
            total += this.PolarTriangleArea(tanLat, lng, prevTanLat, prevLng);
            prevTanLat = tanLat;
            prevLng = lng;
        }
        const areaInMeters = total * (radius * radius);
        const areaInHectares = areaInMeters / 10000;
        return Math.abs(this.round(areaInHectares, 2));
    }
    public round(value: number, decimals: number) {
        return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    }
}
