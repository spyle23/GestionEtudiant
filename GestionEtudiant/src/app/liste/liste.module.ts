import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListeRoutingModule } from './liste-routing.module';
import { ListeUserComponent } from './components/liste-user/liste-user.component';
import { ListeServiceService } from './service/liste-service.service';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    ListeUserComponent
  ],
  imports: [
    CommonModule,
    ListeRoutingModule,
    SharedModule
  ],
  providers: [
    ListeServiceService,
  ]
})
export class ListeModule { }
