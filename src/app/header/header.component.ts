import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authStatusSubs: Subscription;
  loggedIn = false;
  userRoleSub: Subscription;
  userRole: string;
  currentRoute: string

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.router.events
      .subscribe(
        (val) => {
          this.currentRoute = this.router.url;
        }
      );
    this.loggedIn = this.authService.getIsAuth();
    this.userRole = this.authService.getUserRole();

    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(
      (authStatus) => {
        this.loggedIn = authStatus;
        }
      );

    this.userRoleSub = this.authService.getUserRoleListener()
        .subscribe(
          (userRoleUpdated) => {
            this.userRole = userRoleUpdated;
          }
        );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

}
