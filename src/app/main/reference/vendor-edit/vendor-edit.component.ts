import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { VendorService } from '../vendor/vendor.service';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.scss']
})
export class VendorEditComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  editVendorName = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _vendorSerivce: VendorService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._vendorSerivce.GetVendor(params.params.id).subscribe((data: any) => {
          this.model = data.result;
          this.editVendorName = this.model.vendorName;
        })
      }
      );

    this._vendorSerivce.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getVendorName(vendorName) {
    this.checkAssetId = "";
    this.emailExists = false;

    if (vendorName && this.editVendorName != vendorName) {
      this._http.get(Url + 'api/References/Vendor/CheckVendorNameExists/' + vendorName).subscribe((response: any) => {
        this.checkAssetId = response.status ? "Vendor name already exists!!" : " ";
        this.emailExists = response.status;
      });
    }
  }

  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    this._vendorSerivce.UpdateVendor(this.model).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlertMethod('Vendor has been saved', "/reference/vendors");
    })
  }

  Cancel() {
    this.commonService.Cancel();
  }
}
