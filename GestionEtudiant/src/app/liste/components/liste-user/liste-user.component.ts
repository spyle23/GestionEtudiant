import { ObserversModule } from '@angular/cdk/observers';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { interval, map, Observable, of, tap, timeInterval } from 'rxjs';
import { Inscription } from '../../../auth/Models/inscription';

import { Time } from 'src/app/auth/Models/time';
import { AuthService } from 'src/app/auth/service/auth.service';

import { ListeServiceService } from '../../service/liste-service.service';


@Component({
  selector: 'app-liste-user',
  templateUrl: './liste-user.component.html',
  styleUrls: ['./liste-user.component.scss']
})
export class ListeUserComponent implements OnInit {
  displayColumns : string [] = [  'nom' , 'prenom' , 'email', 'pseudo' ];
  user$!:Observable<any>;
  count!:number;
  session$!:Observable<Time>;
  dataSource !: MatTableDataSource<any>;
  constructor(private listeService: ListeServiceService, private authService: AuthService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.session$ = this.authService.timeout$;
    this.listeService.getListe().pipe(
      tap((value)=> {
        this.dataSource = new MatTableDataSource<any>(value);
        this.dataSource.paginator = this.paginator;
      })
    ).subscribe();
    this.checkLogIn();
  }
  checkLogIn(){
    if(localStorage.getItem('token')!=null){
      console.log("ito ve no voalohany")
      this.authService.storeData(localStorage.getItem('token'));
      this.user$ =  this.listeService.getUserById(this.authService.userId);
      this.authService.autoLogout();
    }
  }
}
