import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url, locationAddUrl, locationEditUrl } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Swal from 'sweetalert2';
import { OutOfStockService } from '../out-of-stock.sevice';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  message: boolean = false;
  dateright: any;
  modelForm: any = {};
  correct: any;
  model: any = { assetID: 0, CategoryID: 0 };
  assetsList: any = [];
  userList: any = [];
  categoryList: any = [];
  subcategoryList: any = [];

  constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _outOfStockService: OutOfStockService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
    onClose: function (selectedDates, dateStr, instance) {
      const errorMessageElement = document.getElementById("error-message");
      if (dateStr != null && dateStr != undefined && dateStr != '') {
        errorMessageElement.textContent = "";
      }
      else {
        errorMessageElement.textContent = "Date Required is required";
      }
    }
  };

  ngOnInit(): void {
    this._outOfStockService.GetUsers().subscribe((data: any) => {
      this.userList = data.result.items;
    })
    this._outOfStockService.GetReferenceStatusList().subscribe((data: any) => {
      this.categoryList = data.result.assetCategoryList;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._outOfStockService.GetStock(params.params.id).subscribe((data: any) => {
          this._outOfStockService.GetSubCategory(data.result.categoryId).subscribe((category: any) => {
            if (category.status) {
              this.subcategoryList = category.result;
              this._outOfStockService.GetAssetBySubLevel(data.result.subCategoryId).subscribe((subCategory: any) => {
                if (subCategory.status) {
                  this.assetsList = subCategory.result;
                }
              })
            }
          })
          this.model = data.result;
          this.bindDateRequested(this.model.dateRequested);
        })
      });
  }

  bindDateRequested(date: any) {
    flatpickr("#dateRequested", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: date,
      onClose: function (selectedDates, dateStr, instance) {
        const errorMessageElement = document.getElementById("error-message");
        if (dateStr != null && dateStr != undefined && dateStr != '') {
          errorMessageElement.textContent = "";
        }
        else {
          errorMessageElement.textContent = "Date Requested is required";
        }
      }
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  Save() {
    const errorQuanity = document.getElementById("errorQuanity");
    const quantity = this.model.quanity;
    if (quantity == 0) {
      errorQuanity.textContent = "Quantity is required";
      return;
    }
    else {
      errorQuanity.textContent = "";
    }
    this.coreLoadingScreenService.showLoader("btnSave");
    const user = this.userList.filter(x => x.userId == this.model.requestedbyID)[0];
    this.model.requestedby = `${user.firstName} ${user.lastName}`;
    this.model.assetsId = this.model.assetId;
    this.model.dateRequested = this.model.dateRequested || null;
    this._outOfStockService.UpdateStock(this.model).subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlertMethod('Out of Stock record Updated', "/out_of_stock/logs");
    })
  }

  bindSubCategoryDdl(e) {
    let categoryId = e.target.value;
    this._outOfStockService.GetSubCategory(categoryId).subscribe((data: any) => {
      if (data.status) {
        this.subcategoryList = data.result;
      }
    })
  }

  bindAssetDdl(e) {
    let subCategoryId = e.target.value;
    this._outOfStockService.GetAssetBySubLevel(subCategoryId).subscribe((data: any) => {
      if (data.status) {
        this.assetsList = data.result;
      }
    })
  }
  getQuantity(event) {
    const errorQuanity = document.getElementById("errorQuanity");
    const quantity = event.target.value;
    if (quantity == 0) {
      errorQuanity.textContent = "Quantity is required";
      return;
    }
    else {
      errorQuanity.textContent = "";
    }
  }
}
