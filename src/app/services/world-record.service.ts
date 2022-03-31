
import { Injectable, OnInit } from '@angular/core';
import { WorldRecord } from '../models/WorldRecord';
import wrMenData from 'src/assets/docs/wordRecordsMensTable.json';
import wrWomenData from 'src/assets/docs/wordRecordsWomensTable.json';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Console } from 'console';




@Injectable({
  providedIn: 'root'
})
export class WorldRecordService implements OnInit {
  worldrecordsListMen: Object = wrMenData;
  worldrecordsListWoman: any = wrWomenData;
  endpoint  = "https://api.npoint.io/761e353d476267ffa694";

  
  constructor(private http: HttpClient) {  }
  ngOnInit() {
    //this.http.get(this.endpoint);
    //console.log(this.http.get(this.endpoint))

  }

  recordTimeforMen(raceDistance: string) {

    switch (raceDistance) {
    
      case "42.195":
        return wrMenData.Marathon;
        break;
      case "21.0975":
        return wrMenData['Half Marathon'];
        break;
      case "10":
        return wrMenData['10 Kilometres'];
        break;
      case "5":
        return wrMenData['5 Kilometres'];
        break;

      default:
        break;
    }
    return;
  }
  recordTimeforWomen(raceDistance: string) {

    switch (raceDistance) {
      case "42.195":
        return this.worldrecordsListWoman[7].time;
        break;
      case "21.0975":
        return this.worldrecordsListWoman[5].time;
        break;
      case "10":
        return this.worldrecordsListWoman[3].time;
        break;
      case "5":
        console.log(this.worldrecordsListWoman)
        return this.worldrecordsListWoman[1].time;
        break;

      default:
        break;
    }
    return;
}

 private handleError(error: HttpErrorResponse): any {
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  return throwError(
    'Something bad happened; please try again later.');
  }
  private getRecords(): Observable<any> {
    return this.http.get<WorldRecord>(this.endpoint ).pipe(
      catchError(this.handleError)
    );
  }
}

