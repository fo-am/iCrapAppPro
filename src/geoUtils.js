import React, { Component } from "react";

export default class SphericalUtil extends Component {
  constructor(props) {
    super(props);
  }
  ToRadians(input) {
    return (input / 180.0) * Math.PI;
  }
  PolarTriangleArea(tan1, lng1, tan2, lng2) {
    var deltaLng = lng1 - lng2;
    t = tan1 * tan2;
    return 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
  }

  ComputeSignedArea(path) {
    var radius = 6378137; //earth in meters
    var size = path.length;
    if (size < 3) {
      return 0;
    }
    var total = 0;
    var prev = path[size - 1];
    var prevTanLat = Math.tan(
      (Math.PI / 2 - this.ToRadians(prev.latitude)) / 2
    );
    var prevLng = this.ToRadians(prev.longitude);
    var index;
    for (index = 0; index < path.length; ++index) {
      var tanLat = Math.tan(
        (Math.PI / 2 - this.ToRadians(path[index].latitude)) / 2
      );
      var lng = this.ToRadians(path[index].longitude);
      total += this.PolarTriangleArea(tanLat, lng, prevTanLat, prevLng);
      prevTanLat = tanLat;
      prevLng = lng;
    }
    var areaInMeters = total * (radius * radius);
    var areaInHectares = areaInMeters / 10000;
    return this.round(areaInHectares, 2);
  }
  round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }
}
