import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class HelpsService {
constructor() { }
private $sidenav_toggle: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  setSidenavBehaviour(data: any) {
    this.$sidenav_toggle.next(data);
  }

  getSidenavBehaviour(): Observable<any> {
     return this.$sidenav_toggle.asObservable();
  }

  
}
