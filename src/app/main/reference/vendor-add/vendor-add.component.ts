import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Url } from 'app/colors.const';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../vendor/vendor.service';
import { CommonService } from 'app/common.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.scss']
})
export class VendorAddComponent implements OnInit {
  message: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  clearValue: string = '';
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _vendorSerivce: VendorService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._vendorSerivce.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getVendorName(vendorName) {
    this.checkAssetId = "";
    if (vendorName != null) {
      this._http.get(Url + 'api/References/Vendor/CheckVendorNameExists/' + vendorName).subscribe((response: any) => {
        if (response.status) {
          this.checkAssetId = "Vendor name already exist!!";
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
    this._vendorSerivce.AddVendor(result).subscribe((res: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod('Vendor has been added',"/reference/vendors");
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    })
  }
  Cancel() {
    this.clearValue = null;
  }
}

