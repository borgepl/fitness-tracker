import { Injectable } from "@angular/core";
import { Auth, authState, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import firebase from 'firebase/compat/app';
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AuthService {

  authChange = new Subject<boolean>();
  private user: User;
  private isAuthenticated = false;

  constructor( private router: Router, private auth: AngularFireAuth,
              private trainingService: TrainingService,
              private fsAuth: Auth,
              private uiService: UIService
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

  registerNewUser(authdata: AuthData) {
    createUserWithEmailAndPassword(this.fsAuth, authdata.email, authdata.password)
    .then(usercred => {
      console.log(usercred.user);
      this.authSuccess();
    })
    .catch(
      error => {
        this.uiService.showSnackbar(error.message, null, 3000, "end", "bottom");
        // console.log(error);
      }
    );
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
    this.uiService.loadingStateChanged.next(true);
    this.auth.signInWithEmailAndPassword(authdata.email, authdata.password)
    .then(
      result => {
        console.log(result);
        this.uiService.loadingStateChanged.next(false);
        this.authSuccess();
      }
    )
    .catch(
      error => {
        // console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, "Ok", 3000, "end", "bottom");
      }
    );
  }

  loginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    this.auth.signInWithPopup(provider)
    .then(
      result => {
        console.log(result.credential);
        console.log(result.user)
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
    this.auth.signOut();
    // this.authFailure():
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
