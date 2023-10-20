import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Url, locationAddUrl, locationEditUrl } from 'app/colors.const';
import { LocationService } from '../location.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  message: boolean = false;
  model: any = {};
  statuslist: any = [];
  clearValue: string = '';
  departmentlist: any = [];
  checkAssetId = "";
  checkDepartmentId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private _locationService: LocationService, private location: Location, private commonService: CommonService, private _coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._locationService.GetReferenceStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
      this.departmentlist = data.result.departmentList;
    });
    this.route.paramMap
      .subscribe((params: any) => {
        this._locationService.GetLocation(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
          }
        })
      }
      );
  }

  validateLocationName(location) {
    if (location == null) {
      return;
    }
    this._http.get(`${Url}api/Location/ValidateByLocationName/${location}`).subscribe((response: any) => {
      if (response.status) {
        this.checkAssetId = "Location Name already exist";
        this.emailExists = true;
      }
      else {
        this.checkAssetId = "";
        this.emailExists = false;
      }
    });
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
      console.error(error);
      // Handle the error here
    });
  }

  Cancel() {
    this.clearValue = null;
  }
}
