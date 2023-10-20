import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetAddUrl, AssetEditUrl, UploadAssetDocument, UploadAssetImages, Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import { environment } from 'environments/environment';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Swal from 'sweetalert2';
import { AssetService } from '../asset.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetEditComponent implements OnInit {
  message: boolean = false;
  model: any = {};
  modelForm: any = {};
  images = [];
  envPath = environment.apiUrl;
  documentFile = "";
  itemType = "";
  checkAssetError: string = "";
  editAssetName: string = "";
  docFileUploadError: string = "";
  fileUploadError: string = "";
  isFileValid: boolean = true;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _assetService: AssetService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) {
    this.modelForm.statusID = "";
    this.modelForm.categoryID = "";
    this.modelForm.vendorID = "";
    this.modelForm.subLevelID = "";
    this.modelForm.colorID = "";
    this.modelForm.locationID = "";
    this.modelForm.unitID = "";
    this.modelForm.shareBarCode = 0;
  }

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
  };

  public endOfLifeDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
    minDate: 'today'
  };

  ngOnInit(): void {
    this._assetService.GetAssetItems().subscribe((data: any) => {
      this.model = data.result;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._assetService.GetByIdAssetItems(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.modelForm = data.result;
            this.editAssetName = this.modelForm.assetName;
            this.bindFlatpickr(this.modelForm.subAssets.nextInspectionDate, this.modelForm.subAssets.lastInspectionDate);
            this.modelForm.shareBarCode = data.result.shareBarCode == false ? 0 : 1;
            if (data.result.categoryID != null) {
              this._assetService.GetSubCategory(data.result.categoryID).subscribe((data: any) => {
                if (data.status) {
                  this.model.subCategoryList = data.result;
                }
              });
            }
          }
          if (data.result.assetDocuments != null) {
            this.documentFile = data.result.assetDocuments.fileName;
          }
        })
        this._assetService.GetConfigurationApplication(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.application = data.result;
          }
        });
      }
      );
  }

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    var locationUrl = "";
    if (this.modelForm.id != null) {
      locationUrl = AssetEditUrl;
    }
    else {
      locationUrl = AssetAddUrl;
    }
    if (this.modelForm.MaxRentalDays == "") this.modelForm.MaxRentalDays = 0;
    this.modelForm.shareBarCode = this.modelForm.shareBarCode == "0" ? false : true;
    this._http.post(locationUrl, this.modelForm).subscribe((data: any) => {
      this.modelForm.assetsID = data.result;
      this.modelForm.replacementCost = this.modelForm.subAssets.replacementCost || 0;
      this.modelForm.vendorID = this.modelForm.subAssets.vendorID || null;
      this.modelForm.unitID = this.modelForm.subAssets.unitID || null;
      this.modelForm.colorID = this.modelForm.subAssets.colorID || null;
      this.modelForm.weight = this.modelForm.subAssets.Weight || 0;
      this.modelForm.locationID = this.modelForm.subAssets.locationID || null;
      this.modelForm.quantity = this.modelForm.subAssets.quantity;
      this.modelForm.serialNumber = this.modelForm.subAssets.serialNumber;
      this.modelForm.datePurchased = this.modelForm.subAssets.datePurchased || null;
      this.modelForm.warrantyExpiryDate = this.modelForm.subAssets.warrantyExpiryDate || null;
      this.modelForm.inspectedby = this.modelForm.subAssets.inspectedby;
      this.modelForm.nextMaintenanceDate = this.modelForm.subAssets.nextMaintenanceDate || null;
      this.modelForm.endOfLifeDate = this.modelForm.subAssets.endOfLifeDate || null;
      this.modelForm.lastInspectionDate = this.modelForm.subAssets.lastInspectionDate || null;
      this.modelForm.nextInspectionDate = this.modelForm.subAssets.nextInspectionDate || null;
      this.modelForm.notes = this.modelForm.subAssets.notes;
      this.modelForm.barCodeID = this.modelForm.subAssets.barCodeID;
      this._assetService.AddAuditAsset(this.modelForm).subscribe(() => {
      });
      let objFormData = new FormData();
      if (data.result)
        objFormData.append('AssetId', data.result);
      let files = (<HTMLInputElement>document.getElementById('upload-picture')).files.length;
      if (files > 0) {
        for (var i = 0; i < (<HTMLInputElement>document.getElementById('upload-picture')).files.length; i++) {
          let file = (<HTMLInputElement>document.getElementById('upload-picture')).files[i];
          objFormData.append('files', file, file.name);
        }
      }
      this._http.post(UploadAssetImages, objFormData).subscribe(() => {
        this.coreLoadingScreenService.hideLoader("btnSave");
        this.commonService.simpleAlertMethod('Asset has been updated', "/asset/lists");
      });
      localStorage.setItem('assetitem_type', this.modelForm.itemType);
      localStorage.setItem('asset_name', this.modelForm.assetName);
    })
  }

  bindFlatpickr(nextInspectionDate: string, lastInspectionDate: string) {
    flatpickr("#lastInspectionDate", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: lastInspectionDate,
    });

    flatpickr("#nextInspectionDate", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: nextInspectionDate,
      onChange: function (dateStr, dateObj) {
        flatpickr("#lastInspectionDate", {
          altInput: true,
          altFormat: "d-m-Y",
          minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd'),
        });
      }
    });
  }

  UploadImage(Obj) {
    if (Obj.target.files.length > 3 || this.images.length >= 3) {
      alert('Max three files allowed');
      Obj.preventDefault();
      Obj.value = ""; // clear the older value 
    } else {
      const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
      for (var i = 0; i < Obj.target.files.length; i++) {
        let file = Obj.target.files[i];
        let size = "";
        if (file.type.includes("image")) {
          size = this.application.photosize;
        } else {
          size = this.application.maxAttachmentsize;
        }
        if (size) {
          const fileSizeKB = file.size / 1024;
          if (fileSizeKB > parseInt(size)) {
            this.fileUploadError = `File size must be less than ${size} kb`;
            this.isFileValid = false;
            return;
          }
        }
        if (extensions.length > 0 && !extensions.some(x => file.name.toLowerCase().endsWith(x))) {
          this.fileUploadError = `File must be of type ${this.application.fileExtensions}`;
          this.isFileValid = false;
          return;
        }
        this.isFileValid = true;
        this.fileUploadError = "";
        const reader = new FileReader();
        reader.onload = e => this.images.push(reader.result);
        reader.readAsDataURL(file);
      }
    }
  }
  keyPressText(event) {
    this.commonService.keyPressAlphaNumericWithCharacters(event);
  }
  keyPressNumber(event) {
    this.commonService.validNumbers(event);
  }
  selectsubcategory(e) {
    let subCategoryId = e.target.selectedIndex;
    this._assetService.GetSubCategory(subCategoryId).subscribe((data: any) => {
      if (data.status) {
        this.model.subCategoryList = data.result;
      }
    })
  }

  validateAssetName(event) {
    this.commonService.keyPressAlphaNumericWithCharacters(event);
    var asset = event.target.value;
    if (asset != null && asset != "" && this.editAssetName != asset) {
      this._http.get(Url + 'api/asset/ExistAssetName/' + asset).subscribe((response: any) => {
        if (response.status) {
          this.checkAssetError = "Asset name already exist!!";
        }
        else {
          this.checkAssetError = "";
        }
      });
    }
  }

  UploadDocument(e) {
    if (e.target.files.length == 0) {
      this.isFileValid = true;
      this.docFileUploadError = "";
      return;
    }
    const file = e.target.files[0];
    const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
    let size = "";
    if (file.type.includes("image")) {
      size = this.application.photosize;
    } else {
      size = this.application.maxAttachmentsize;
    }
    if (size) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > parseInt(size)) {
        this.docFileUploadError = `File size must be less than ${size} kb`;
        this.isFileValid = false;
        return;
      }
    }
    if (extensions.length > 0 && !extensions.some(x => file.name.toLowerCase().endsWith(x))) {
      this.docFileUploadError = `File must be of type ${this.application.fileExtensions}`;
      this.isFileValid = false;
      return;
    }
    this.isFileValid = true;
    this.docFileUploadError = "";
  }
}
