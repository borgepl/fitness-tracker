import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth: boolean = false;
  authUserEmail: string;
  private authSub: Subscription;

  constructor( private authService: AuthService) { }


  ngOnInit(): void {
    this.authSub = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
    this.authService.authUser.subscribe(email => this.authUserEmail = email);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  onLoginGoogle() {
    this.authService.loginWithGoogle();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


}
