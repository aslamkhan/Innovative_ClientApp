import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonService } from 'app/common.service';
import { Url } from 'app/colors.const';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  message: boolean = false;
  model: any = {};
  locationList: any = [];
  departmentList: any = [];
  statuslist: any = [];
  images = [];
  checkEmailError = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;
  role: string;
  fileUploadError: string = "";
  isFileValid: boolean = true;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  constructor(private route: ActivatedRoute, private _http: HttpClient, private setting: FormBuilder, private router: Router, private _customerService: CustomerService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }
  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap.subscribe((params: any) => {
      this._customerService.GetLocation().subscribe((data: any) => {
        this.locationList = data.result.assetLocationList;
        this.statuslist = data.result.assetStatusList;
        this.departmentList = data.result.departmentList;
      });
      this._customerService.GetConfigurationApplication(params.params.id).subscribe((data: any) => {
        if (data.status) {
          this.application = data.result;
        }
      });
    });

    this.dropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.dropDownForm = this.setting.group({
      myItems: [this.selectedItems]
    });
  }
  getEmail(email) {
    this.checkEmailError = "";
    if (email != null) {
      this._http.get(Url + 'api/Customer/ExistCustomerEmail/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkEmailError = "Email Address already exist";
          this.emailExists = true;
        }
        else {
          this.checkEmailError = " ";
          this.emailExists = false;
        }
      });
    }
  }

  getPhoneNumber(phoneNumber: string) {
    if (phoneNumber !== '') {
      this._http.get(Url + 'api/Customer/ExistCustomerPhoneNumber/' + phoneNumber).subscribe((response: any) => {
        if (response.result) {
          this.checkPhonenumber = "Phone Number already exists";
          this.noExists = true;
        } else {
          this.checkPhonenumber = "";
          this.noExists = false;
        }
      });
    } else {
      this.checkPhonenumber = "";
      this.noExists = false;
    }
  }

  UploadImage(Obj) {
    const file = Obj.target.files[0];
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
    this.images = [];
    reader.onload = e => this.images.push(reader.result);
    reader.readAsDataURL(file);
  }

  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    let objFormData = new FormData();
    let files = (<HTMLInputElement>document.getElementById('upload-picture')).files.length;
    if (files > 0) {
      let file = (<HTMLInputElement>document.getElementById('upload-picture')).files[files - 1];
      objFormData.append('CustomerImage', file, file.name);
    } else {
      objFormData.append('CustomerImage', null);
    }
    objFormData.append('DepartmentId', result.departmentId);
    objFormData.append('FirstName', result.firstName);
    objFormData.append('LastName', result.lastName);
    objFormData.append('PhoneNumber', result.phoneNumber != null && result.phoneNumber != undefined ? result.phoneNumber : '');
    objFormData.append('Email', result.email);
    objFormData.append('StatusId', result.statusId);
    objFormData.append('Comments', result.comments != null ? result.comments : "");
    objFormData.append('LocationId', result.locationId);
    this._customerService.AddCustomer(objFormData).subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (data.status) {
        this.commonService.simpleAlertMethod('Customer has been added', "/customer/list");
      } else {
        this.commonService.simpleErrorAlertMethod(data.result);
      }
    })
  }
}