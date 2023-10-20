import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service/authentication.service';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class MfaComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public mfaForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error: string;
  public email: string;
  loginDetail: any = {};
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this._authenticationService.currentUserValue) {
      this._router.navigate(['/']);
    }

    this._unsubscribeAll = new Subject();
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
    // Configure the layout

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.mfaForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.mfaForm.invalid) {
      return;
    }

    this.loading = true;
    let MFA: any = {
      'EmailId': this.email,
      'OTP': this.f.otp.value,
    }
    this._authenticationService.checkMFA(MFA).subscribe((res: any) => {
      this.loading = false;
      if (res.status) {
        localStorage.setItem('mfa_value', "1");
        this._router.navigateByUrl(this.returnUrl);
        return true;
      } else {
        this.error = "Invalid OTP";
        return false;
      }
    }, err => {
      this.loading = false; 0.
    })
  };

  ngOnInit(): void {
    this.mfaForm = this._formBuilder.group({
      otp: ['', [Validators.required]]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this.email = JSON.parse(localStorage.getItem('emailId'));
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}