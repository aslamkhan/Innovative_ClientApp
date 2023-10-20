import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Url } from 'app/colors.const';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0, departmentId: 0 };
  rolesList: any;
  deparmentsList: any = [];
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;

  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _userSerivce: UserService, private _coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._userSerivce.GetReferenceStatusList().subscribe((data: any) => {
          this.statuslist = data.result.assetStatusList;
          this.deparmentsList = data.result.departmentList;
          this.rolesList = data.result.roles;
          this.model = data.result;
        })
      }
      );
  }

  getEmail(email) {
    // emails.email = "";
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/User/CheckIsUserEmailExist/' + email).subscribe((response: any) => {
        if (response.status) {
          this.checkAssetId = "Email Address already exist";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
          this.emailExists = false;
        }
      });

    }
  }

  simpleAlert() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">User has been added</div>',
      showConfirmButton: false,
      timer: 30000,
      heightAuto: true,
    })
  }
  Save(form: NgForm) {
    this._coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    let objFormData = new FormData();
    var checkbox: any = document.getElementById("employeeType");
    var isChecked = checkbox.checked;
    if (isChecked) result.employeeType = "1"; else result.employeeType = "0";
    objFormData.append('FirstName', result.firstName);
    objFormData.append('LastName', result.lastName);
    objFormData.append('Role', result.roleId);
    objFormData.append('EmailAddress', result.emailAddress);
    objFormData.append('Password', result.password);
    objFormData.append('Department', result.departmentId);
    objFormData.append('EmployeeType', result.employeeType);
    // objFormData.append('Country', result.country);
    this._userSerivce.AddAzureADUser(objFormData).subscribe(() => {
      this._coreLoadingScreenService.hideLoader("btnSave");
      this.simpleAlert();
      this.router.navigateByUrl("/user/list");
    })
  }

  keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z_ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";


}
