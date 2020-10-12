import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorldRecordService {
  records = {
    wr5KMen: [0, 12, 37],
    wr5KWomen: [0, 14, 6],
    wr10KMen: [0, 26, 11],
    wr10KWomen: [0, 29, 17],
    wrhalfMarathonMen: [0, 58, 1],
    wrhalfMarathonWomen: [1, 5, 34],
    wrMarathonMen: [2, 1, 39],
    wrMarathonWomen: [2, 14, 4],
  };


  constructor() {}

  recordTimeforMen(raceDistance: string) {
    console.log(raceDistance);

    switch (raceDistance) {
      case "42.195":
        return this.records.wrMarathonMen;
        break;
      case "21.0975":
        return this.records.wrhalfMarathonMen;
        break;
      case "10":
        return this.records.wr10KMen;
        break;
      case "5":
        return this.records.wr5KMen;
        break;

      default:
        break;
    }
    return;
  }
  recordTimeforWomen(raceDistance: string) {
    console.log(raceDistance);

    switch (raceDistance) {
      case "42.195":
        return this.records.wrMarathonWomen;
        break;
      case "21.0975":
        return this.records.wrhalfMarathonWomen;
        break;
      case "10":
        return this.records.wr10KWomen;
        break;
      case "5":
        return this.records.wr5KWomen;
        break;

      default:
        break;
    }
    return;
  }
}
