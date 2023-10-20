import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutOfStockService } from '../out-of-stock.sevice';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { AssetService } from 'app/main/asset/asset.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  message: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  model: any = {};
  assetsList: any = [];
  userList: any = [];
  categoryList: any = [];
  subcategoryList: any = [];
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _outOfStockService: OutOfStockService, private commonService: CommonService, private _assetService: AssetService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
    allowInput: true
  };

  ngOnInit(): void {
    this._outOfStockService.GetUsers().subscribe((data: any) => {
      this.userList = data.result.items;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._outOfStockService.GetReferenceStatusList().subscribe((data: any) => {
          this.categoryList = data.result.assetCategoryList;
        })

      });
  }

  Save(form: NgForm) {
    const errorQuanity = document.getElementById("errorQuanity");
    const quantity = form.value.Quanity;
    if (quantity == 0) {
      errorQuanity.textContent = "Quantity is required";
      return;
    }
    else {
      errorQuanity.textContent = "";
    }
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    var DateRequested = new Date(result.DateRequested).toISOString(); // convert date to ISO string
    const user = this.userList.filter(x => x.userId == result.requestedbyID)[0];
    result.DateRequested = result.DateRequested;
    result.requestedby = `${user.firstName} ${user.lastName}`;
    this._outOfStockService.AddStock(result).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlertMethod('Out of Stock record Created', "/out_of_stock/logs");
    })
  }

  bindSubCategoryDdl(e) {
    let categoryId = e.target.value;
    this._assetService.GetSubCategory(categoryId).subscribe((data: any) => {
      if (data.status) {
        this.subcategoryList = data.result;
      }
    })
  }

  bindAssetDdl(e) {
    let subCategoryId = e.target.value;
    this._assetService.GetAssetBySubLevel(subCategoryId).subscribe((data: any) => {
      if (data.status) {
        this.assetsList = data.result;
      }
    })
  }

  ngAfterViewInit() {
    flatpickr("#DateRequested", {
      altInput: true,
      altFormat: "d-m-Y",
      onClose: function (selectedDates, dateStr, instance) {
        const errorMessageElement = document.getElementById("error-message");
        if (dateStr != null && dateStr != undefined && dateStr != '') {
          errorMessageElement.textContent = "";
        }
        else {
          errorMessageElement.textContent = "Date Requested is required";
        }
      },
      onChange: function (dateStr, instance) {
        const errorMessageElement = document.getElementById("error-message");
        if (dateStr[0] != null && dateStr[0] != undefined) {
          errorMessageElement.textContent = "";
        }
        else {
          errorMessageElement.textContent = "Date Requested is required";
        }
      }
    });
  }
  getQuantity(event) {
    const errorQuanity = document.getElementById("errorQuanity");
    errorQuanity.textContent = "";
    const quantity = event.target.value;
    if (quantity == 0 && quantity != "") {
      errorQuanity.textContent = "Quantity is required";
      return;
    }
    else {
      errorQuanity.textContent = "";
    }
  }
}