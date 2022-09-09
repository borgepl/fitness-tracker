import { Injectable } from "@angular/core";
import { Auth, authState } from "@angular/fire/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import firebase from 'firebase/compat/app';
import { TrainingService } from "../training/training.service";

@Injectable()
export class AuthService {

  authChange = new Subject<boolean>();
  private user: User;
  private isAuthenticated = false;

  constructor( private router: Router, private auth: AngularFireAuth,
              private trainingService: TrainingService,
              //private fsAuth: Auth
              ) {}

  initAuthListener() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.authSuccess();
      } else {
        this.authFailure();
      }
    })
   }

  registerUser(authdata: AuthData) {
    this.auth.createUserWithEmailAndPassword(authdata.email, authdata.password)
    .then(
      result => {
        console.log(result);
        this.authSuccess();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    );
  }

  login(authdata: AuthData) {
    this.auth.signInWithEmailAndPassword(authdata.email, authdata.password)
    .then(
      result => {
        console.log(result);
        this.authSuccess();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    );
  }

  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(
      result => {
        console.log(result);
        this.authSuccess();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    );
  }

  registerFakeUser(authdata: AuthData) {
    this.user = {
      email: authdata.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccess();
  }

  fakelogin(authdata: AuthData) {
    this.user = {
      email: authdata.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccess();
  }

  logout() {
    this.trainingService.cancelSubscriptions();
    this.auth.signOut();
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccess() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  private authFailure() {
    this.trainingService.cancelSubscriptions();
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

}
