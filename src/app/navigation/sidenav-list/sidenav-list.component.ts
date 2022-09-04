import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() closeLink = new EventEmitter<void>() ;

  isAuth = false;
  authSub: Subscription;

  constructor( private authService: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  onCloseLink() {
    this.closeLink.emit();
  }

  onLogout() {
    this.onCloseLink();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
