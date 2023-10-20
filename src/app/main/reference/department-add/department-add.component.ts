import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DepartmentService } from '../department/department.service';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { Url } from 'app/colors.const';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})

export class DepartmentAddComponent implements OnInit {
  message: boolean = false;
  registerForm: FormGroup;
  submitted = false;

  statuslist: any = [];
  model: any = { statusId: 0 };
  checkDepartmentNameError = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _departmentService: DepartmentService, private fb: FormBuilder, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._departmentService.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getDepartmentName(departmentName) {
    this.checkDepartmentNameError = "";
    if (departmentName != null) {
      this._http.get(Url + 'api/References/ExistDepartmentName/' + departmentName).subscribe((response: any) => {
        if (response.result) {
          this.checkDepartmentNameError = "Department name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkDepartmentNameError = " ";
          this.emailExists = false;
        }
      });
    }
  }

  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    this._departmentService.AddDepartment(result).subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (data.status) {
        this.commonService.simpleAlertMethod('Department has been added', "/reference/departments");
      } else {
        this.commonService.simpleErrorAlertMethod(data.result);
      }
    })
  }
}
