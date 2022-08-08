import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GestionEtudiant';

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.checkLogIn();
  }

  checkLogIn(){
    if(localStorage.getItem('token')!=null){
      this.authService.storeData(localStorage.getItem('token'));
      this.authService.autoLogout();
      this.router.navigateByUrl('/liste');
    }
  }
}
