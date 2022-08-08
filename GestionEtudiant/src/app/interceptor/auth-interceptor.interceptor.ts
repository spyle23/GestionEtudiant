import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(localStorage.getItem('token')!=null){
      const headers = new HttpHeaders()           //définition de l'entête du requete
            .append('authorization', `Bearer ${localStorage.getItem('token')}`);
        const modifiedReq = request.clone({headers}); // req est immuable(on ne peut le modifier), on le conne en modifiant l'entête
        return next.handle(modifiedReq);
    }
    return next.handle(request);

  }
}
