import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetAddUrl, AssetEditUrl, UploadAssetDocument, UploadAssetImages, Url } from 'app/colors.const';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { AssetService } from '../asset.service';
import { CategoryAddComponent } from 'app/main/reference/category-add/category-add.component';
import Swal from 'sweetalert2';
import { CreateComponent } from 'app/main/location/create/create.component';
import { LocationService } from 'app/main/location/location.service';
import { CommonService } from 'app/common.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddMaintenanceComponent {
  message: boolean = false;
  model: any = {};
  images = [];
  registerForm: FormGroup;
  submitted = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _assetService: AssetService, private modalService: NgbModal, private commonService: CommonService, private _coreLoadingScreenService: CoreLoadingScreenService) {

  }
  public birthDateselect: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y'
  };
  modalOpenLG(modalLG) {
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  
  ngOnInit(): void {
    flatpickr("#expectedEndDate", {
      altInput: true,
      altFormat: "d-m-Y",
      minDate: 'today',
      onClose: function (selectedDates, dateStr, instance) {
        const errorMessageElement = document.getElementById("error-end-message");
        if (dateStr != null && dateStr != undefined && dateStr != '') {
          errorMessageElement.textContent = "";
        }
        else {
          errorMessageElement.textContent = "Expected End Date is required";
        }
      }
    });
    
    flatpickr("#expectedStartDate", {
      altInput: true,
      altFormat: "d-m-Y",
      minDate: 'today',
      onChange: function (dateStr, dateObj) {
        flatpickr("#expectedEndDate", {
          altInput: true,
          altFormat: "d-m-Y",
          minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd'),
          onClose: function (selectedDates, dateStr, instance) {
            const errorMessageElement = document.getElementById("error-end-message");
            if (dateStr != null && dateStr != undefined && dateStr != '') {
              errorMessageElement.textContent = "";
            }
            else {
              errorMessageElement.textContent = "Expected End Date is required";
            }
          }
        });
      },
      onClose: function (selectedDates, dateStr, instance) {
        const errorMessageElement = document.getElementById("error-start-message");
        if (dateStr != null && dateStr != undefined && dateStr != '') {
          errorMessageElement.textContent = "";
        }
        else {
          errorMessageElement.textContent = "Expected Start Date is required";
        }
      }
    });
    this.model.statusId = "Schedule";
  }

  Save(form: NgForm) {
    this._coreLoadingScreenService.showLoader("btnSave");
    form.value.barCodeID = localStorage.getItem('asset_barcodeId');
    form.value.assestsID = localStorage.getItem('item_assetId');
    form.value.statusId = "2";
    var result = form.value;
    this._http.post(Url + "api/Maintenance/Insert", result).subscribe(() => {
      this._coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlert("Maintenance has been saved")
      this.router.navigateByUrl("/asset/maintenances");
    })
  }

  Cancel() {
    this.commonService.Cancel();
  }
}