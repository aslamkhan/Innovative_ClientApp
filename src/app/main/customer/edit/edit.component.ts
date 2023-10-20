import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { CustomerService } from '../customer.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  message: boolean = false;
  model: any = {};
  locationList: any = [];
  statuslist: any = [];
  departmentList: any = [];
  images = [];
  checkEmailError = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  fileUploadError: string = "";
  isFileValid: boolean = true;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _customerService: CustomerService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._customerService.GetLocation().subscribe((data: any) => {
      this.locationList = data.result.assetLocationList;
      this.statuslist = data.result.assetStatusList;
      this.departmentList = data.result.departmentList;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._customerService.GetCustomer(params.params.id).subscribe((data: any) => {
          this.model = data.result;
        })
        this._customerService.GetConfigurationApplication(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.application = data.result;
          }
        });
      }
      );
  }

  getEmail(email) {
    this.checkEmailError = "";
    if (email != null) {
      this._http.get(Url + 'api/Customer/ExistCustomerEmail/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkEmailError = "Email Address already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkEmailError = "";
          this.emailExists = false;
        }
      });
    }
  }

  getPhoneNumber(phoneNumber: string) {
    if (phoneNumber !== '') {
      this._http.get(Url + 'api/Customer/ExistCustomerPhoneNumber/' + phoneNumber).subscribe((response: any) => {
        if (response.result) {
          this.checkPhonenumber = "Phone Number already exists!!";
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
    if (Obj.target.files.length > 0) {
      const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
      for (var i = 0; i < Obj.target.files.length; i++) {
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
        reader.onload = e => {
          this.model.customerImage = reader.result as string;
        }
        reader.readAsDataURL(file);
      }
    }
  }

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    let objFormData = new FormData();
    for (var i = 0; i < (<HTMLInputElement>document.getElementById('upload-picture')).files.length; i++) {
      let file = (<HTMLInputElement>document.getElementById('upload-picture')).files[i];
      if (file != null && file != undefined) {
        objFormData.append('CustomerImage', file, file.name);
      } else {
        objFormData.append('CustomerImage', null);
      }
    }
    objFormData.append('FirstName', this.model.firstName);
    objFormData.append('Id', this.model.id);
    objFormData.append('LastName', this.model.lastName);
    objFormData.append('PhoneNumber', this.model.phoneNumber != null && this.model.phoneNumber != undefined ? this.model.phoneNumber : '');
    objFormData.append('Email', this.model.email);
    objFormData.append('DepartmentId', this.model.departmentId);
    objFormData.append('StatusId', this.model.statusId);
    objFormData.append('Comments', this.model.comments != null ? this.model.comments : "");
    objFormData.append('LocationId', this.model.locationId);
    this._customerService.UpdateCustomer(objFormData).subscribe((res: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod('Customer has been Updated', "/customer/list");
      } else {
        this.commonService.simpleErrorAlertMethod("Customer has not been Updated");
      }
    })
  }
}