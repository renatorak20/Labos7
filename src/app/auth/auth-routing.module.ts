import { NgModule } from '@angular/core';
import {Route, RouterModule} from "@angular/router";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../components/Register/Register.component';

const routes : Route[] = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
