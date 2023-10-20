import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService) { }

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var accesstoken = JSON.parse(localStorage.getItem('user_access_token'));
    var accesstokenExpire = JSON.parse(localStorage.getItem('user_access_token_expire_time'));
    if (accesstoken) {
      if (new Date() <= new Date(accesstokenExpire)) {
        var is_mfa_required = JSON.parse(localStorage.getItem('is_mfa_required'));
        if (is_mfa_required) {
          if (JSON.parse(localStorage.getItem('mfa_value'))) {
            return true;
          } else {
            this._router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
          }

        } else {
          return true;
        }
      } else {
        this._router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

    }
    else {
      // not logged in so redirect to login page with the return url
      this._router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }


  }
}
