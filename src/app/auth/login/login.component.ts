import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private loadingSub: Subscription;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
  });

  isLoading = false;

  constructor( private authService: AuthService, private uiService: UIService) { }


  ngOnInit(): void {
    this.loadingSub =  this.uiService.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading);
  }

  onLogin() {
    // console.log(this.loginForm.value);
    this.authService.loginUser({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    })
  }

  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }

  }

}
