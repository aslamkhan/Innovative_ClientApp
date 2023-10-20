import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0, roleId: 0 };
  rolesList: any;
  deparmentsList: any = [];
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  isEmailExists: boolean = false;
  modelEmployeeType: boolean;
  isEmployeeType: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _userService: UserService, private commonService: CommonService,
    private _coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._userService.GetReferenceStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
      this.deparmentsList = data.result.departmentList;
      this.rolesList = data.result.roles;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._userService.GetUser(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
            this.model.IsEdit = data.result.employeeType == "1" ? true : false;
            var email = JSON.parse(localStorage.getItem('emailId'));
            if (email == data.result.emailAddress) {
              this.isEmailExists = true;
            }
          }
        })
      }
      );
  }

  getEmail(email) {
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/User/CheckIsUserEmailExist/' + email).subscribe((response: any) => {
        if (response.status == true) {
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
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">User has been updated</div>',
      showConfirmButton: false,
      timer: 30000,
      heightAuto: true,
    })
  }
  Save() {
    this._coreLoadingScreenService.showLoader("btnEdit");
    var role: any = document.getElementById("role");
    var department: any = document.getElementById("department");
    //var location: any = document.getElementById("location");
    let objFormData = new FormData();
    var checkbox: any = document.getElementById("employeeType");
    if (checkbox != null) {
      var isChecked = checkbox.checked;
      if (isChecked) this.model.employeeType = "1"; else this.model.employeeType = "0";
    }
    else {
      this.model.employeeType = "0";
    }
    objFormData.append('UserId', this.model.userId);
    objFormData.append('FirstName', this.model.firstName);
    objFormData.append('LastName', this.model.lastName);
    objFormData.append('Role', role.options[role.selectedIndex].text);
    objFormData.append('EmailAddress', this.model.emailAddress);
    // objFormData.append('Country', location.options[location.selectedIndex].text);
    objFormData.append('Department', department.options[department.selectedIndex].text);
    objFormData.append('EmployeeType', this.model.employeeType);
    this._userService.UpdateUser(objFormData).subscribe(() => {
      this._coreLoadingScreenService.hideLoader("btnEdit");
      this.message = true;
      this.simpleAlert();
      this.router.navigateByUrl("/user/list");
    })
  }
  Cancel() {
    this.commonService.Cancel();
  }
}
