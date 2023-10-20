import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { DepartmentService } from '../department/department.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})

export class DepartmentEditComponent implements OnInit {
  message: boolean = false;

  model: any = { statusId: 0 };
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _departmentService: DepartmentService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._departmentService.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._departmentService.GetDepartment(params.params.id).subscribe((data: any) => {
          this.model = data.result;
        })

      }
      );
  }

  getDepartmentName(email) {
    // emails.email = "";
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistDepartmentName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "Department name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
          this.emailExists = false;
        }
      });
    }
  }

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    this._departmentService.UpdateDepartment(this.model).subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.router.navigateByUrl("/reference/departments");
      if (data.status) {
        this.commonService.simpleAlertMethod('Department has been saved', "/reference/departments");
      } else {
        this.commonService.simpleErrorAlertMethod(data.result);
      }
    })
  }
}
