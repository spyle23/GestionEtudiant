import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable()
export class ListeServiceService {

  constructor(private http: HttpClient) { }

  public getListe(): Observable<any>{
    return this.http.get(environment.urlApi+'/liste');
  }
  public getUserById(id: number): Observable<any>{
    return this.http.get(environment.urlApi+'/liste/'+id).pipe(
      tap((value)=> console.log(value))
    );
  }
}
