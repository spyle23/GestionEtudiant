import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, delay, map,  mapTo,  Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Inscription } from '../Models/inscription';
import { Time } from '../Models/time';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token!:any;
  _loading$ = new BehaviorSubject<boolean>(false);
  jwtHelper = new JwtHelperService();
  delay!:any;
  userId!:number;
  intervalId!:any;
  _timeout$ = new BehaviorSubject<Time>({ minutes: 0, secondes: 0 });

  public getToken(): string{
    return this.token;
  }

  public get loading$() : Observable<boolean> {
    return this._loading$.asObservable();
  }
  public get timeout$(): Observable<Time>{
    return this._timeout$.asObservable();
  }
  public setLoadingStatus(): void{
    this._loading$.next(!this._loading$.value);
  }

  constructor( private http: HttpClient, private router: Router ) { }
  private saveToken(token: string): void{
    this.token = token;
    localStorage.setItem('token', token);
  }

  private convertTime(time: number): Time{
    let minutes = Math.floor(time / 60000);
    let secondes = Math.floor(((time % 60000) / 1000)) ;

    return { minutes, secondes }
  }

  public signIn(sign: { email: string, mdp: string }): Observable<any>{
    return this.http.post(environment.urlApi+'/auth/login', JSON.stringify(sign)).pipe(
      delay(1000),
      map((value)=> value.toString()),
      tap((token)=> {
        this.saveToken(token);
      }),
      catchError(()=>of(false).pipe(
        delay(1000)
      ))
    );
  }
  public singUp(inscription: Inscription): Observable<boolean>{
    return this.http.post<boolean>(environment.urlApi+'/auth/register', JSON.stringify(inscription)).pipe(
      mapTo(true),
      delay(1000),
      catchError(()=>of(false).pipe(
        delay(1000)
      ))
    );
  }
  public storeData(token: any){
    this.token = token;
    this.userId = this.jwtHelper.decodeToken(token).userId;
    this.delay = this.jwtHelper.getTokenExpirationDate(token)!.valueOf() - new Date().getTime();
    const duree = this.delay;
    this._timeout$.next(this.convertTime(duree));
  }

  public autoLogout(): void{
    console.log(this.intervalId);
    clearInterval(this.intervalId);
    this.intervalId =  setInterval(()=>{
      if (this._timeout$.value.secondes>0) {
        console.log("ato am secondes");
        this._timeout$.next({ minutes: this._timeout$.value.minutes, secondes: this._timeout$.value.secondes-1 });
      }else if(this._timeout$.value.secondes<=0){
        console.log("ato am minutes");
        this._timeout$.next({ minutes: this._timeout$.value.minutes-1, secondes: 59})
      }
    }, 1000);
    setTimeout(()=>{
      this.logout();
    }, this.delay)
  }

  public logout(): void{
    this.token = null;
    clearInterval(this.intervalId);
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }
}
