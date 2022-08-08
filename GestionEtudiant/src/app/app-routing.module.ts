import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path:'auth',loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'liste', loadChildren:()=> import('./liste/liste.module').then(m=>m.ListeModule),
    canActivate: [AuthGuardGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
