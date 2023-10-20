import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { CommonService } from 'app/common.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService, private _commonService: CommonService) { }

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var accesstoken = JSON.parse(localStorage.getItem('user_access_token'));
    var location = JSON.parse(localStorage.getItem('office_location'));
    if (request.url.indexOf("asset") == -1) {
      this._commonService.removeAssetStorage();
    }
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accesstoken}`,
          office_location: `${location}`
        }
      });
    }

    return next.handle(request);
  }
}
