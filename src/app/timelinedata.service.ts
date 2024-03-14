import { Injectable } from '@angular/core';
import { Timeline } from './models/timeline';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimelinedataService {

  //url will be the domain we get from the aws elastic beanstalk
  //http://<url>/api/Timelines
  Timelineurl:string='http://localhost:8686/timeline'
  constructor(private httpservice: HttpClient) { }

  GetTimelines():Observable<Timeline>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow requests from any origin (replace with specific origin in production)
    });
    return this.httpservice.get<Timeline>(this.Timelineurl,{headers})
      .pipe(retry(3), catchError(this.myerrorhandler))
  }
  GetTimelinesById(id:string):Observable<Timeline>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow requests from any origin (replace with specific origin in production)
    });
    console.log(id)
    return this.httpservice.get<Timeline>(this.Timelineurl+"/user/"+id,{headers})
      .pipe(retry(3), catchError(this.myerrorhandler))
  }

  DeleteTimeline(id: string | undefined): Observable<void> {
    const url = `${this.Timelineurl}/${id}`; // Construct the URL for the specific Timeline
    return this.httpservice.delete<void>(url)
      .pipe(
        catchError(this.myerrorhandler) // Handle errors
      );
  }

  UpdateTimeline(id: string|undefined, updatedTimelineData: any): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow requests from any origin (replace with specific origin in production)
    });
    const url = `${this.Timelineurl}/${id}`;
    return this.httpservice.put<void>(url, updatedTimelineData, {headers})
      .pipe(
        catchError(this.myerrorhandler)
      );
  }
  
  PostTimeline(newTimelineData: any): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow requests from any origin (replace with specific origin in production)
    });
    const url = `${this.Timelineurl}`;
    return this.httpservice.post<void>(url, newTimelineData, {headers})
      .pipe(
        catchError(this.myerrorhandler)
      );
  }
  
  private myerrorhandler(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred.. either client side or network:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
