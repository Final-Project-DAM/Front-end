import { Component, OnInit } from '@angular/core';
import { EventsResult } from '../../interface/event';
import { UsersResponse, User } from '../../interface/users';
import { FiltersService } from 'src/app/services/events/filters.service';
import { GetEventsService } from '../../services/events/get-events.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  filteredEvents: EventsResult[] = [];
  events: EventsResult[] | undefined;
  event: EventsResult | undefined;
  eventsToRender: EventsResult[] = [];
  place = 'Todos';
  tipoEvento = 'Todos';
  token: string | null= '';
  username: string | undefined;
  user?: User;
  fav: boolean = false;
  email: any;
  pageNum : number = 1;

  constructor(
    private eventServices: GetEventsService,
    private service: FiltersService,
    private route: Router,
    private authServices: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.get10Events();
    this.token = localStorage.getItem('token');
    if (this.token) {
      (await this.authServices.getUserByToken(this.token)).subscribe(
        async (resp) => {
          if (resp) {
            this.user = resp.user;
          }
          return;
        },
      );
    }
  }

  event_detail(id: string) {
    this.eventServices.getEventDetails(id);
    this.route.navigateByUrl(`/events/${id}`);
  }

  async change1(event: Event) {
    const {
      // @ts-ignore
      target: { value },
    } = event;

    this.place = value;
    (await this.service.getFilteredEvents(this.place, this.tipoEvento))
    .subscribe(resp => {
      if(resp){
        this.eventsToRender = resp;
      }
    });
  }

  async change2(event: Event) {
    const {
      // @ts-ignore
      target: { value },
    } = event;

    this.tipoEvento = value;

    (await this.service.getFilteredEvents(this.place, this.tipoEvento))
    .subscribe(resp => {
      if(resp){
        this.eventsToRender = resp;
      }
    });
  }

  async getEvent(id: string) {
    (await this.eventServices.getEventDetails(id)).subscribe((resp) => {
      this.event = resp;
    });
  }

  removeSeeFavorites() {
    this.eventsToRender = this.events as EventsResult[];
    this.fav = false;
    this.tipoEvento = 'Todos';
    this.place = 'Todos';
    this.hideen = false;
  }

  hideen = false;

  async getFavouritesFromAPI() {
    if(this.token)
    (await this.authServices.loginIdAndFavorites(this.token))
      .subscribe( resp => {
        if(resp){
          this.eventsToRender = resp.favorites;
          this.fav = true;
          this.hideen = true;
        }

    })
  }

  backPage(){
    if(this.pageNum === 1){
      return alert('Esta usted en la primera página');
    } else {
      this.pageNum = this.pageNum - 1;
      this.get10Events();
    }
  }

  nextPage(){
    this.pageNum = this.pageNum + 1;
    this.get10Events();
  }


  get10Events(){
    this.service.getEventsByPageNum(this.pageNum).then(eventos => {
      if(eventos === 'no se encuentran mas eventos'){
        alert('Esta usted en la última página.');
      }else{
        this.events = eventos;
        this.eventsToRender = eventos;
      }
    })
  }
}
