import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetAddUrl, AssetEditUrl, locationAddUrl, locationEditUrl, UploadAssetDocument, UploadAssetImages, Url } from 'app/colors.const';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { AssetService } from '../asset.service';
import { CategoryAddComponent } from 'app/main/reference/category-add/category-add.component';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from "flatpickr";
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
@Component({
  selector: 'app-asset-create',
  templateUrl: './asset-create.component.html',
  styleUrls: ['./asset-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetCreateComponent implements OnInit {
  message: boolean = false;
  model: any = {};
  modelForm: any = {};
  images = [];
  closeResult: string = '';
  statuslist: any = [];
  checkCategoryError = "";
  checkPhonenumber = "";
  checkSubCategoryError = "";
  checkColorError = "";
  checkVendorError = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  departmentList: any = [];
  colorList: any = [];
  assetSubcategoryList: any = [];
  assetCategory: any = [];
  vendorList: any = [];
  locationList: any = [];
  checkAssetError: string = "";
  dropdownEnable: number = 0;
  shareBarcode: string = "";
  SerialNumberError: string = "";
  docFileUploadError: string = "";
  fileUploadError: string = "";
  isFileValid: boolean = true;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _assetService: AssetService, private modalService: NgbModal, private commonService: CommonService, private _coreLoadingScreenService: CoreLoadingScreenService) {
    this.modelForm.statusID = "";
    this.modelForm.categoryID = "";
    this.modelForm.DepartmentID = "";
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
    utc: true,
    enableTime: false
  };

  public endOfLifeDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
    minDate: 'today'
  };

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._assetService.GetAssetItems().subscribe((data: any) => {
          this.model = data.result;
          if (data.result) {
            this.statuslist = data.result.assetStatusList;
            this.colorList = data.result.assetColorList;
            this.assetSubcategoryList = data.result.subCategoryList;
            this.assetCategory = data.result.assetCategoryList;
            this.vendorList = data.result.assetVendorList;
            this.locationList = data.result.assetLocationList;
            this.departmentList = data.result.departmentList;
            this.bindFlatpickr();
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

  bindFlatpickr() {
    flatpickr("#nextInspectionDate", {
      altInput: true,
      altFormat: "d-m-Y",
    });

    flatpickr("#lastInspectionDate", {
      altInput: true,
      altFormat: "d-m-Y",
      onChange: function (dateStr, dateObj) {
        flatpickr("#nextInspectionDate", {
          altInput: true,
          altFormat: "d-m-Y",
          minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd'),
        });
      }
    });
  }

  getColorName(email) {
    if (email != null) {
      this._http.get(Url + 'api/References/ExistColorName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkColorError = "Color name already exist";
          this.emailExists = true;
        }
        else {
          this.checkColorError = " ";
          this.emailExists = false;
        }
      });
    }
  }

  getCategoryName(email) {
    this.checkSubCategoryError = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistSubCategoryName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkSubCategoryError = "SubCategory Name already exist";
          this.emailExists = true;
        }
        else {
          this.checkSubCategoryError = " ";
          this.emailExists = false;
        }
      });

    }
  }

  getCategoriesName(email) {
    this.checkCategoryError = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistCategoryName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkCategoryError = "Category name already exist";
          this.emailExists = true;
        }
        else {
          this.checkCategoryError = " ";
          this.emailExists = false;
        }
      });
    }
  }

  getVendorName(vendorName) {
    this.checkVendorError = "";
    if (vendorName != null) {
      this._http.get(Url + 'api/References/Vendor/CheckVendorNameExists/' + vendorName).subscribe((response: any) => {
        if (response.status == true) {
          this.checkVendorError = "Vendor name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkVendorError = " ";
          this.emailExists = false;
        }
      });

    }
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
  Save(form: NgForm) {
    var element = document.getElementById("btnAssetSave");
    element.classList.add("spinner-loading");
    var result = form.value;
    var locationUrl = "";
    if (result.id != null) {
      locationUrl = AssetEditUrl;
    }
    else {
      locationUrl = AssetAddUrl;
    }
    if (result.MaxRentalDays == "") {
      result.MaxRentalDays = 0;
    }
    var barcode: any = document.getElementById("shareBarCode");
    result.shareBarCode = barcode.value == '0' ? false : true;
    this._http.post(locationUrl, result).subscribe((data: any) => {
      if (!data.status) {
        element.classList.remove("spinner-loading");
        this.commonService.simpleErrorAlertMethod(data.result);
        return;
      }
      result.assetsID = data.result;
      if (result.datePurchased == '') result.datePurchased = null;
      else result.datePurchased = result.datePurchased[0];//this.addOneDay(result.datePurchased[0]);
      if (result.lastInspectionDate == '') result.lastInspectionDate = null;
      if (result.nextInspectionDate == '') result.nextInspectionDate = null;
      if (result.nextMaintenanceDate == '') result.nextMaintenanceDate = null;
      else
        result.nextMaintenanceDate = result.nextMaintenanceDate[0];//this.addOneDay(result.nextMaintenanceDate[0]);
      if (result.endOfLifeDate == '') result.endOfLifeDate = null;
      else
        result.endOfLifeDate = result.endOfLifeDate[0];//this.addOneDay(result.endOfLifeDate[0]);
      if (result.warrantyExpiryDate == '') result.warrantyExpiryDate = null;
      else
        result.warrantyExpiryDate = result.warrantyExpiryDate[0];//this.addOneDay(result.warrantyExpiryDate[0]);
      result.assestsID = data.result;
      if (result.replacementCost == "") result.replacementCost = 0;
      if (result.vendorID == "") result.vendorID = null;
      if (result.unitID == "") result.unitID = null;
      if (result.colorID == "") result.colorID = null;
      if (result.Weight == "") result.Weight = 0;

      let objFormData = new FormData();
      let objFormDocument = new FormData();
      if (data.result)
        objFormData.append('AssetId', data.result);
      let files = (<HTMLInputElement>document.getElementById('upload-picture')).files.length;
      for (var i = 0; i < (<HTMLInputElement>document.getElementById('upload-picture')).files.length; i++) {
        let file = (<HTMLInputElement>document.getElementById('upload-picture')).files[i];
        objFormData.append('files', file, file.name);
      }
      this._http.post(UploadAssetImages, objFormData).subscribe(() => {
      });

      objFormDocument.append('AssetId', data.result);

      // let filesone = (<HTMLInputElement>document.getElementById('change-document')).files.length;
      for (var i = 0; i < (<HTMLInputElement>document.getElementById('change-document')).files.length; i++) {
        let filetwo = (<HTMLInputElement>document.getElementById('change-document')).files[i];
        //objFormDocument.delete('files');
        objFormDocument.append('file', filetwo, filetwo.name);
      }
      this._http.post(UploadAssetDocument, objFormDocument).subscribe(() => {
      });
      this._assetService.AddSubAsset(result).subscribe((data: any) => {
        if (data.status) {
          element.classList.remove("spinner-loading");
          this.commonService.simpleAlertMethod('The Asset has been saved', "/asset/lists");
        }
      });
    })
  }

  addOneDay(date) {
    const originalDate = new Date(date);
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    return new Date(originalDate.getTime() + oneDay);
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
  modalOpenLG(modalLG) {
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  keyPressText(event) {
    this.commonService.keyPressAlphaNumericWithCharacters(event);
  }
  keyPressNumber(event) {
    this.commonService.validNumbers(event);
  }

  //Modal
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

    });
  }
  selectsubcategory(e) {
    let subCategoryId = e.target.value;
    this._assetService.GetSubCategory(subCategoryId).subscribe((data: any) => {
      if (data.status) {
        this.model.subCategoryList = data.result;
      }
    })
  }

  modalOpensLG(modallLG) {
    this.modalService.open(modallLG, {
      centered: true,
      size: "md",
    });
    this.checkColorError = "";
  }

  modalOpenVendorLG(modalVLG) {
    this.modalService.open(modalVLG, {
      centered: true,
      size: "md",
    });
    this.checkVendorError = "";
  }

  modalOpenLocationLG(modalLocLG) {
    this.modalService.open(modalLocLG, {
      centered: true,
      size: "md",
    });
  }

  modalOpenSubCategoryLG(modalSubLG) {
    this.modalService.open(modalSubLG, {
      centered: true,
      size: "md",
    });
    this.checkSubCategoryError = "";
  }

  modalOpenCategoryLG(modalCategoryLG) {
    this.modalService.open(modalCategoryLG, {
      centered: true,
      size: "md",
    });
    this.checkCategoryError = "";
  }

  SaveColor(form: NgForm) {
    var result = form.value;
    this._assetService.AddColor(result).subscribe(() => {
      this.commonService.simpleAlertMethod('Color has been added')
      this.modalService.dismissAll();
      this._assetService.GetAssetItems().subscribe((data: any) => {
        this.colorList = data.result.assetColorList;
      })
    })
  }
  SaveVendor(form: NgForm) {
    var result = form.value;
    this._assetService.AddVendor(result).subscribe(() => {
      this.commonService.simpleAlertMethod('Vendor has been added');
      this.modalService.dismissAll();
      this._assetService.GetAssetItems().subscribe((data: any) => {
        this.vendorList = data.result.assetVendorList;
      })
    })
  }

  SaveLocation(form: NgForm) {
    this._coreLoadingScreenService.showLoader("savebtnLocation");
    var result = form.value;
    var locationUrl = "";
    if (this.model.id != null) {
      locationUrl = locationEditUrl;
    }
    else {
      locationUrl = locationAddUrl;
    }

    this._http.post(locationUrl, result).subscribe((res: any) => {
      this._coreLoadingScreenService.hideLoader("savebtnLocation");
      if (res.status) {
        this.commonService.simpleAlertMethod('The location has been added');
        form.resetForm();
        this.modalService.dismissAll();
        this._assetService.GetAssetItems().subscribe((data: any) => {
          this.locationList = data.result.assetLocationList;
        })
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    }, (error) => {
      this._coreLoadingScreenService.hideLoader("savebtnLocation");
    })
  }

  SaveSubCategory(form: NgForm) {
    var result = form.value;
    this._assetService.AddSubCategory(result).subscribe(() => {
      this.commonService.simpleAlertMethod('Asset Sub Category has been added')
      this.modalService.dismissAll();
      this._assetService.GetAssetItems().subscribe((data: any) => {
        this.model = data.result;
        this._assetService.GetSubCategory(result.categoryID).subscribe((data: any) => {
          if (data.status) {
            this.model.subCategoryList = data.result;
          }
        })
      })
    })
  }

  SaveCategory(form: NgForm) {
    var result = form.value;
    this._assetService.AddCategory(result).subscribe(() => {
      this.commonService.simpleAlertMethod('Category has been added')
      this.modalService.dismissAll();
      this._assetService.GetAssetItems().subscribe((data: any) => {
        this.assetCategory = data.result.assetCategoryList;
      })
    })
  }

  Cancels() {
    this.model = {};
    this.modalService.dismissAll();
  }

  ItemTypeChange(itemType) {
    switch (itemType.viewModel) {
      // case "1":
      //   this.dropdownEnable = 1;
      //   this.shareBarcode = "1";
      //   break;
      case "2":
        this.dropdownEnable = 2;
        break;
      default:
        this.dropdownEnable = 0;
        break;
    }
  }

  validateAssetName(event) {
    this.commonService.keyPressAlphaNumericWithCharacters(event);
    var asset = event.target.value;
    if (asset != null && asset != "") {
      this._http.get(Url + 'api/asset/ExistAssetName/' + asset).subscribe((response: any) => {
        if (response.status) {
          this.checkAssetError = "Item name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkAssetError = "";
          this.emailExists = false;
        }
      });
    } else {
      this.checkAssetError = "";
      this.emailExists = false;
    }
  }

  validateSerialNumber(event) {
    var serial = event.target.value;
    if (serial) {
      const url = `${Url}api/asset/ExistSerialNumber/${serial}`;

      this._http.get(url).subscribe((response: any) => {
        const SerialNumberError = response.status ? 'Serial number already exists!' : '';
        const emailExists = response.status ? true : false;

        this.SerialNumberError = SerialNumberError;
        this.emailExists = emailExists;
      })
    } else {
      this.SerialNumberError = '';
      this.emailExists = false;
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