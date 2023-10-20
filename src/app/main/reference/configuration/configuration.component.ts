import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'app/common.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ConfigurationService } from './configuration.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})

export class ConfigurationComponent implements OnInit {
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  fileExtensions: [];
  message: boolean = false;
  model: any = { companyName: '', companyUrl: '', email: '', country: '', contactNumber: '', registrationNumber: 0 };
  manage: any = { changePasswordDay: '', loginAttempts: '', passwordExpiry: '', timeCountPassword: '', sessionTimeout: '', photoSize: '' };
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  config: any = {};
  images: any;
  url: string;
  urlError = false;
  emailError = false;
  role: string;
  allowedRoles: any = ['admin', 'supervisor', 'shop attendant'];
  fileUploadError: string = "";
  isFileValid: boolean = true;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _configurationService: ConfigurationService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
    utc: true,
    enableTime: false
  };
  validateUrl() {
    if (this.model.companyUrl != null && this.model.companyUrl != undefined && !this.model.companyUrl.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
      this.urlError = true;
    } else {
      this.urlError = false;
    }
  }

  validateEmail() {
    if (!this.model.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      this.emailError = true;
    } else {
      this.emailError = false;
    }
  }
  ngOnInit(): void {

    this.dropdownList = [
      { value: 'png', text: '.png' },
      { value: 'jpeg', text: '.jpeg' },
      { value: 'jpg', text: '.jpg' },
      { value: 'doc', text: '.doc' },
      { value: 'docx', text: '.docx' },
      { value: 'xls', text: '.xls' },
      { value: 'xlsx', text: '.xlsx' },
      { value: 'msword', text: 'application/msword' },
      { value: 'vnd', text: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ];
    var dropdownOptions = this.dropdownList;
    this.dropdownSettings = {
      idField: 'value',
      textField: 'text'
    };
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap
      .subscribe((params: any) => {
        this._configurationService.GetConfigurationAbout(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
            this.images = data.result;
          }
        })
      }
      );

    this.route.paramMap
      .subscribe((params: any) => {
        this._configurationService.GetConfigurationManagement(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.manage = data.result;
          }
        })
      }
      );

    this.route.paramMap
      .subscribe((params: any) => {
        this._configurationService.GetConfigurationApplication(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.application = data.result;
            var fileExtensions = data.result.fileExtensions.split(",");
            this.application.fileExtensions = dropdownOptions.filter(x => fileExtensions.includes(x.value));
          }
        })
      }
      );

    this.route.paramMap
      .subscribe((params: any) => {
        this._configurationService.GetConfiguration(params.params.id).subscribe((data: any) => {
          data.result.lastLoginTime = new DatePipe('en-US').transform(data.result.lastLoginTime, 'dd-MM-yyyy')
          this.config = data.result;
        })
      }
      );

  }

  UploadImage(Obj) {
    const file = Obj.target.files[0];
    if (file != null && file != undefined) {
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
      reader.onload = e => {
        this.model.uploadLogo = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    const formData = new FormData();
    formData.append("Id", this.model.id != null ? this.model.id : 0);
    formData.append("CompanyName", this.model.companyName);
    formData.append("CompanyUrl", this.model.companyUrl != null && this.model.companyUrl != undefined ? this.model.companyUrl : '');
    formData.append("Email", this.model.email);
    formData.append("Country", this.model.country);
    formData.append("ContactNumber", this.model.contactNumber);
    formData.append("RegistrationNumber", this.model.registrationNumber);

    const fileInput = document.getElementById('file-upload-single') as HTMLInputElement;
    const files = fileInput?.files?.length;
    const file = files ? fileInput.files[files - 1] : null;
    formData.append('UploadLogo', file);

    const apiMethod = this.model.id != null ? this._configurationService.UpdateConfigurationAbout(formData) : this._configurationService.AddConfigurationAbout(formData);
    apiMethod.subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      const message = 'Configuration has been Updated';
      if (data.status) this.commonService.simpleAlertMethod(message);
    });
  }

  SaveManagement() {
    this.coreLoadingScreenService.showLoader("btnSaveManagement");
    this.manage.photoSize = this.manage.photoSize != '' ? this.manage.photoSize : null;
    this.manage.changePasswordDay = this.manage.changePasswordDay != '' ? this.manage.changePasswordDay : null;
    this.manage.loginAttempts = this.manage.loginAttempts != '' ? this.manage.loginAttempts : null;
    const apiMethod = this.manage.id != null ? this._configurationService.UpdateConfigurationManagement(this.manage) : this._configurationService.AddConfigurationManagement(this.manage);

    apiMethod.subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSaveManagement");
      const message = 'Configuration has been Updated';
      if (data.status) this.commonService.simpleAlertMethod(message);
    });

  }

  SaveApplication() {
    this.coreLoadingScreenService.showLoader("btnSaveApplication");
    if (this.application.orderNumber == '') this.application.orderNumber = null;
    if (this.application.itemNumber == '') this.application.itemNumber = null;
    var extensions: any = '';
    this.application.fileExtensions.forEach(element => {
      extensions += element.value + ",";
    });
    this.application.fileExtensions = extensions.slice(0, -1);
    const apiMethod = this.application.id != null ? this._configurationService.UpdateConfigurationApplication(this.application) : this._configurationService.AddConfigurationApplication(this.application);
    apiMethod.subscribe((data: any) => {
      this.coreLoadingScreenService.hideLoader("btnSaveApplication");
      const message = 'Configuration has been Updated';
      if (data.status) this.commonService.simpleAlertMethod(message);
    });
  }

  SaveConfiguration() {
    const apiMethod = this.config.id != null ? this._configurationService.UpdateConfiguration(this.config) : this._configurationService.AddConfiguration(this.config);

    apiMethod.subscribe(() => {
      const message = this.config.id != null ? 'Configuration has been Updated' : 'Configuration has not been added';
      this.commonService.simpleAlertMethod(message);
    });
  }
}
