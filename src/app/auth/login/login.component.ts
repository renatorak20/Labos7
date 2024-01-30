import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup<any>;
  isPasswordWrong = false;

  constructor(private auth : AuthService, private router : Router) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      'username' : new FormControl(null, [Validators.required]),
      'password' : new FormControl(null, [Validators.required])
    });

    if(this.auth.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  onLogin(){
    this.auth.login(this.loginForm!!.value);
  }

}
