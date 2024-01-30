import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject, from, map, of, switchMap} from "rxjs";
import { User } from '../models/User.model';
import * as bcrypt from 'bcryptjs';
import { DataService } from '../services/Data.service';

@Injectable()
export class AuthService implements OnInit {

  private user : User | null = null;
  errorEmitter : Subject<string> = new Subject<string>();
  authChange : Subject<boolean> = new Subject<boolean>();

  users: User[] = [];
  usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private router : Router, private dataService: DataService) { }

  ngOnInit() {
    console.log("Auth service");
    this.dataService.getUsers()
    .subscribe((res:any) => {
      this.users = res.rows;
      this.usersSubject.next([...this.users]);
    })
  }


  login(credentials: { username: string, password: string }) {
    this.dataService.getUsers().pipe(
      switchMap(users => {
        this.users = users;
        this.usersSubject.next([...this.users]);
        const user = users.find(u => u.username === credentials.username);
        return user ? from(bcrypt.compare(credentials.password, user.password)).pipe(
          map(passwordValid => passwordValid ? user : undefined)
        ) : of(undefined);
      })
    ).subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.authChange.next(true);
        this.router.navigate(['']);
      }
    });
  }
  

  logout(){
    this.user=null;
    localStorage.removeItem('user');
    this.authChange.next(false);
    this.router.navigate(['/auth']);
  }

  getUser(){
    let u = localStorage.getItem('user');
    if (u) {
      this.user=JSON.parse(u);
      return {...this.user} as User;
    }
    return null;
  }

  isAuthenticated(){
    const user = this.getUser();
    return user != null;
  }

  doesUserExist(username: string) {
    return this.users.find((user) => user.username == username);
  }

  async addUser(newuser: User) {
      this.dataService.getUsers()
      .subscribe(async (res:any) => {
        this.users = res;
        this.usersSubject.next([...this.users]);
        if (!this.doesUsernameExists(newuser.username)) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(newuser.password, salt);
          const newUser = new User(newuser.username, hash, newuser.name, newuser.email);
          this.dataService.addUser(newUser)
          .subscribe((res => {
            this.users.push(newUser);
            this.usersSubject.next([...this.users]);
            const userCredentials = {
              username: newuser.username,
              password: newuser.password
            };
            this.login(userCredentials);
          }))
        }
      })
  }

  doesUsernameExists(username: string) {
    return this.users.some(user => user.username == username);
  }

}
