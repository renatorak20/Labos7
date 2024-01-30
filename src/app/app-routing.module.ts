import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './components/Posts/Posts.component';
import { AuthModule } from './auth/auth.module';
import { ProfileComponent } from './components/Profile/Profile.component';

const routes: Routes = [
  {path: '', component: PostsComponent},
  {path: 'auth', loadChildren: () => AuthModule},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
