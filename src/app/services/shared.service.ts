import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private itemSubject = new Subject<any>();
  item$= this.itemSubject.asObservable();

  emitItem(item:any){
      this.itemSubject.next(item)
  }

}
