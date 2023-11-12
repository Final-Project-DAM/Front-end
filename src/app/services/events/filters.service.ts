import { HttpClient } from '@angular/common/http';
import { EventsResult } from '../../interface/event';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  eventosCanarios: EventsResult[] = [];
  urlEventos = 'https://api-canary-events.netlify.app/events';

  constructor(private http: HttpClient) {}

  async getEvents(): Promise<EventsResult[]> {
    const response = await axios.get(this.urlEventos);
    return response.data;
  }

  getEventsByPageNum(pageNum : number){
    return axios.get(this.urlEventos + '?page=' + pageNum).then(resp => resp.data);
  }

  getFilteredEvents(place: string, tipoEvent: string, ): Observable<EventsResult[] | undefined>{
    let response: Observable<EventsResult[] | undefined>;

    if (place !== 'Todos' && tipoEvent === 'Todos') {
      response = this.http.get<EventsResult[]>(`${this.urlEventos}/filter/filter?place=${place}`)
      .pipe(
        map((resp: EventsResult[]) => {
          console.log('resp '+resp);
          return resp.length > 0 ? resp : undefined;
        }),
      );
    }
    else if (place !== 'Todos' && tipoEvent !== 'Todos') {
      response = this.http.get<EventsResult[]>(`${this.urlEventos}/filter/filter?place=${place}&tipo_event=${tipoEvent}`)
      .pipe(
        map((resp: EventsResult[]) => {
          console.log('resp '+resp);
          return resp.length > 0 ? resp : undefined;
        }),
      );
    }
    else if (place === 'Todos' && tipoEvent !== 'Todos') {
      response = this.http.get<EventsResult[]>(`${this.urlEventos}/filter/filter?tipo_event=${tipoEvent}` )
      .pipe(
        map((resp: EventsResult[]) => {
          console.log('resp '+resp);
          return resp.length > 0 ? resp : undefined;
        }),
      );
    }
    else{
       response = this.http.get<EventsResult[]>(`${this.urlEventos}`)
       .pipe(
         map((resp: EventsResult[]) => {
          console.log('resp '+resp);
          return resp.length > 0 ? resp : undefined;
         }),
       );
    }

    return response;
  }
}
