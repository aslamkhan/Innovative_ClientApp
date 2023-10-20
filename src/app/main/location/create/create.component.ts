import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url, locationAddUrl, locationEditUrl } from 'app/colors.const';
import { LocationService } from '../location.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-location-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  message: boolean = false;
  model: any = { departmentID: "", statusId: "" };
  statuslist: any = [];
  clearValue: string = '';
  departmentlist: any = [];
  checkAssetId = "";
  checkDepartmentId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _locationService: LocationService, private location: Location, private commonService: CommonService, private _coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._locationService.GetReferenceStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
      this.departmentlist = data.result.departmentList;
    });
  }

  getLocationName(location) {
    if (location == null || !this.model?.departmentID) {
      return;
    }
    this._http.get(`${Url}api/Location/ExistLocationName?LocationName=${encodeURIComponent(location)}&DepartmentID=${this.model.departmentID}`).pipe(
      tap((response: any) => {
        if (response.status) {
          this.checkAssetId = "Location Name already exist";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
          this.checkDepartmentId = "";
          this.emailExists = false;
        }
      })
    ).subscribe();
  }

  validateLocationName(location) {
    this.checkAssetId = "";
    if (location == null) {
      return;
    }
    this._http.get(`${Url}api/Location/ValidateByLocationName/${location}`).subscribe((response: any) => {
      if (response.status) {
        this.checkAssetId = "Location Name already exist";
        this.emailExists = true;
      }
      else {
        this.checkAssetId = " ";
        this.emailExists = false;
      }
    });
  }

  validateLocation(departmentId) {
    if (departmentId == null) {
      return;
    }
    this._http.get(`${Url}api/Location/ExistLocationName?LocationName=${encodeURIComponent(this.model.location)}&DepartmentID=${departmentId}`).pipe(
      tap((response: any) => {
        if (response.status) {
          this.checkDepartmentId = "Location Name with this department already exist";
          this.emailExists = true;
        }
        else {
          this.checkDepartmentId = "";
          this.checkAssetId = " ";
          this.emailExists = false;
        }
      })
    ).subscribe();
  }

  Save() {
    this._coreLoadingScreenService.showLoader("btnSave");
    const locationUrl = (this.model.id != null) ? locationEditUrl : locationAddUrl;
    const { model = {} } = this;

    this._http.post(locationUrl, model).subscribe((res: any) => {
      this._coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod("Location has been saved", "/location/list");
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    }, (error) => {
      this._coreLoadingScreenService.hideLoader("btnSave");
    });
  }

  SaveApplication() {
    if (this.model.id != null) {
      this._locationService.Updatelocation(this.model).subscribe(() => {
        this.commonService.simpleAlertMethod('The Location has been Updated', "/location/list");
      })
    }
    else {
      this._locationService.AddLocation(this.model).subscribe(() => {
        this.commonService.simpleAlertMethod('The Location has been added', "/location/list");
      })
    }
  }

  Cancel() {
    this.clearValue = null;
  }
}
