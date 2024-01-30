import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './components/Post/Post.component';
import { PostsComponent } from './components/Posts/Posts.component';
import { NewPostDialogComponent } from './components/NewPostDialog/NewPostDialog.component';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/auth.service';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './components/Profile/Profile.component';
import { HeadersInterceptor } from './utils/headers.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    PostsComponent,
    NewPostDialogComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(),
    DatePipe,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
