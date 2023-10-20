import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetConditionService } from '../asset-condition/asset-condition.service';
import { Validators, FormGroup, FormBuilder, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { Url } from 'app/colors.const';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-asset-condition-add',
  templateUrl: './asset-condition-add.component.html',
  styleUrls: ['./asset-condition-add.component.scss']
})
export class AssetConditionAddComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  model: any = { statusId: 0 };
  statuslist: any = [];

  message: boolean = false;
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private _http: HttpClient, private router: Router, private _assetConditionService: AssetConditionService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._assetConditionService.GetCondition(params.params.id).subscribe((data: any) => {
          this.model = data.result;
          this.registerForm.setValue(this.model);
        })
      }
      );
    this._assetConditionService.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getConditionName(email) {
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

  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    this._assetConditionService.AddCondition(result).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlertMethod('Asset condition has been added', "/reference/asset_conditions");
    })
  }
}
