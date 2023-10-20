import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { AssetConditionService } from '../asset-condition/asset-condition.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-asset-condition-edit',
  templateUrl: './asset-condition-edit.component.html',
  styleUrls: ['./asset-condition-edit.component.scss']
})
export class AssetConditionEditComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _assetConditionService: AssetConditionService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._assetConditionService.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._assetConditionService.GetCondition(params.params.id).subscribe((data: any) => {
          this.model = data.result;
        })

      }
      );
  }
  simpleAlert() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">Your work has been saved</div>',
      showConfirmButton: false,
      timer: 30000,
      heightAuto: true,
    })
  }

  getConditionName(email) {
    // emails.email = "";
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistConditionName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "Condition name already exist!!";
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
    this._assetConditionService.UpdateCondition(this.model).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlert("Asset condition has been saved")
      this.router.navigateByUrl("/reference/asset_conditions");
    })
  }

}
