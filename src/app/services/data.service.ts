import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  
// PUT API for saving and editing student enrollment data

  addData(collectionName: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.apiUrl+collectionName, data, { headers });
  }

// GET API for retrieving student enrollment records by ID

 getDataById(collectionName:string,id:string):Observable<any>{
  const headers = new HttpHeaders ({'Content-Type': 'application/json'});
  return this.http.get<any>(`${this.apiUrl}entities/${collectionName}/${id}`,{headers}) 
 }

  getjosn(jsonName: any) {
    return this.http.get(`assets/json/${jsonName}.json`)
  }
}