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

@Component({
  selector: 'app-asset-editquantity',
  templateUrl: './asset-editquantity.component.html',
  styleUrls: ['./asset-editquantity.component.scss']
})
export class AssetEditquantityComponent implements OnInit {
  message: boolean = false;
  model: any = {};
  modelForm: any = {};
  images = [];
  envPath = environment.apiUrl;
  documentFile = "";
  itemType = "";
  subAssets: any = {};
  fileUploadError: string = "";
  docFileUploadError: string = "";
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
    this.modelForm.subAssets = this.subAssets;
    this.modelForm.subAssets.quantity = 0;
  }

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y'
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
            this.modelForm.shareBarCode = data.result.shareBarCode == false ? 0 : 1;
            this.modelForm.subAssets.quantity = 0;
            if (data.result.categoryID != null) {
              this._assetService.GetSubCategory(data.result.categoryID).subscribe((response: any) => {
                if (response.status) {
                  this.model.subCategoryList = response.result;
                }
              })
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
    if (this.modelForm.MaxRentalDays == "") {
      this.modelForm.MaxRentalDays = 0;
    }
    this.modelForm.shareBarCode = this.modelForm.shareBarCode == "0" ? false : true;
    this._http.post(locationUrl, this.modelForm).subscribe((data: any) => {
      this.modelForm.assetsID = data.result;
      const subAssets = this.modelForm.subAssets;
      subAssets.datePurchased = subAssets.datePurchased || null;
      subAssets.lastInspectionDate = subAssets.lastInspectionDate || null;
      subAssets.nextInspectionDate = subAssets.nextInspectionDate || null;
      subAssets.endOfLifeDate = subAssets.endOfLifeDate || null;
      subAssets.nextMaintenanceDate = subAssets.nextMaintenanceDate || null;
      subAssets.warrantyExpiryDate = subAssets.warrantyExpiryDate || null;
      subAssets.replacementCost ||= 0;
      subAssets.vendorID ||= null;
      subAssets.unitID ||= null;
      subAssets.colorID ||= null;
      subAssets.Weight ||= 0;
      subAssets.assestsID = data.result;
      subAssets.shareBarCode = this.modelForm.shareBarCode;

      let objFormData = new FormData();
      let objFormDocument = new FormData();
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
      });

      objFormDocument.append('AssetId', data.result);
      files = (<HTMLInputElement>document.getElementById('change-document')).files.length;
      if (files > 0) {
        for (var i = 0; i < (<HTMLInputElement>document.getElementById('change-document')).files.length; i++) {
          let file = (<HTMLInputElement>document.getElementById('change-document')).files[i];
          objFormDocument.append('file', file, file.name);
        }
      }
      this._http.post(UploadAssetDocument, objFormDocument).subscribe(() => {
      });
      this._assetService.AddSubAsset(subAssets).subscribe(() => {
        this.coreLoadingScreenService.hideLoader("btnSave");
        this.commonService.simpleAlertMethod('Asset Quantity has been added', '/asset/lists');
      });
      localStorage.setItem('assetitem_type', this.modelForm.itemType);
      localStorage.setItem('asset_name', this.modelForm.assetName);
    })
  }

  UploadImage(Obj) {
    if (Obj.target.files.length > 3 || this.images.length >= 3) {
      alert('Max three files allowed');
      Obj.preventDefault();
      Obj.value = ""; // clear the older value 
    } else {
      const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
      for (var i = 0; i < Obj.target.files.length; i++) {
        this.modelForm.assetPictures = null;
        const file = Obj.target.files[i];
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
