import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  constructor() {
    setTimeout(() => {

      this.emitItem("personal")
    }, 100);
  }
  

  private itemSubject = new Subject<any>();
  item$ = this.itemSubject.asObservable();

  emitItem(item: any) {
    console.log("EMMITTED ITEM Are", item);

    this.itemSubject.next(item)
  }

  getemitItem(): Observable<any> {
    return this.itemSubject.asObservable();
  }


}
