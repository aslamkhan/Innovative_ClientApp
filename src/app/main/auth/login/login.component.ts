import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service/authentication.service';
import { CoreConfigService } from '@core/services/config.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    //  Public
    public coreConfig: any;
    public loginForm: FormGroup;
    public loading = false;
    public submitted = false;
    public returnUrl: string;
    public error = '';
    public passwordTextType: boolean;
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

        // Configure the layout
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
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loginDetail.username = this.f.email.value;
        this.loginDetail.password = this.f.password.value;
        // Login
        this.loading = true;
        this._authenticationService.login(this.loginDetail).subscribe((user: any) => {
            if (user.status && user.result.access_token) {
                let token_expire = new Date();
                token_expire.setSeconds(token_expire.getSeconds() + parseInt(user.result.expires_in));
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user_access_token', JSON.stringify(user.result.access_token));
                localStorage.setItem('user_access_token_expire_time', JSON.stringify(token_expire));
                localStorage.setItem('user_role', JSON.stringify(user.result.userRole.toLowerCase()));
                localStorage.setItem('office_location', JSON.stringify(user.result.officeLocation));
                localStorage.setItem('is_mfa_required', user.result.isMFARequired);
                if (user.result.employeeType == "1") {
                    this._authenticationService.sendMFA(this.loginDetail).subscribe((res) => {
                        this._router.navigateByUrl('/auth/mfa');
                        localStorage.setItem('emailId', JSON.stringify(user.result.emailId));
                    });
                }
                else {
                    this._router.navigate([this.returnUrl]);
                    localStorage.setItem('emailId', JSON.stringify(user.result.emailId));
                }
            } else {
                this.error = "Invalid User name or Password";
                this.loading = false;
                return false;
            }
            this.loading = false;
        },
            err => {
                this.loading = false;
            });
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
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
