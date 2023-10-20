import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDatatablesService } from 'app/main/order/list/datatables.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgForm } from '@angular/forms';
import { OrderService } from '../order.service';
import { HttpClient } from '@angular/common/http';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { orderPage, orderStatus } from '../order.module';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  role: string;
  // public
  public sidebarToggleRef = false;
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  model: any = {};
  url = "";
  images = [];
  customerList: any = [];
  locationList: any = { locationID: 0 };
  departmentList: any = { departmentId: 0 };
  statuslist: any = { statusId: 0 };
  checkEmailError: string = "";
  checkPhonenumber: string = "";
  emailExists: boolean = null;
  noExists: boolean = null;
  fileUploadError: string = "";
  isFileValid: boolean = true;
  pendingStatus = orderPage.Pending;
  openStatus = orderPage.Open;
  allStatus = orderPage.All;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };

  @ViewChild(DatatableComponent) table: DatatableComponent;
  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.customerName.toLowerCase().indexOf(val) !== -1 || !val || d.id == val;
    });
    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;

  }

  /**
   * Constructor
   *
   * @param {OrderDatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(private _http: HttpClient, private _datatablesService: OrderDatatablesService, private modalService: NgbModal, private _coreSidebarService: CoreSidebarService, private _orderService: OrderService,
    private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) {
    this._unsubscribeAll = new Subject();
    // this._coreTranslationService.translate(english, french, german, portuguese);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
    this._orderService.GetLocation().subscribe((data: any) => {
      this.locationList = data.result.assetLocationList;
      this.statuslist = data.result.assetStatusList;
      this.departmentList = data.result.departmentList;
    });
    this._orderService.GetConfigurationApplication().subscribe((data: any) => {
      if (data.status) {
        this.application = data.result;
      }
    });
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  modalOpenLG(modalLG) {
    this.images = [];
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  modalOpenXs(modalxs, url) {
    this.url = url;
    this.modalService.open(modalxs, {
      centered: true,
      size: 'md'
    });
  }

  UploadImage(Obj) {
    const file = Obj.target.files[0];
    const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];

    let size = file.type.includes("image") ? this.application.photosize : this.application.maxAttachmentsize;
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

  SaveCustomer(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    let objFormData = new FormData();
    let files = (<HTMLInputElement>document.getElementById('drap-picture')).files.length;
    if (files > 0) {
      let file = (<HTMLInputElement>document.getElementById('drap-picture')).files[files - 1];
      objFormData.append('CustomerImage', file, file.name);
    } else {
      objFormData.append('CustomerImage', null);
    }
    objFormData.append('FirstName', result.firstName);
    objFormData.append('LastName', result.lastName);
    objFormData.append('PhoneNumber', result.phoneNumber);
    objFormData.append('Email', result.email);
    objFormData.append('DepartmentId', result.departmentId);
    objFormData.append('StatusId', result.statusId);
    objFormData.append('Comments', result.comments != null ? result.comments : "");
    objFormData.append('LocationId', result.locationId);
    this._orderService.AddCustomerList(objFormData).subscribe((response: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlertMethod('Customer has been added');
      var objListItem = {
        value: response.result.id,
        text: response.result.firstName + ' ' + response.result.lastName
      }
      this.customerList.push(objListItem);
      this.modalService.dismissAll();
    });
  }

  getEmail(email) {
    if (!email) {
      return;
    }
    const url = `${Url}api/Customer/ExistCustomerEmail/${email}`;
    this._http.get(url).subscribe((response: any) => {
      this.checkEmailError = response.result ? "Email Address already exists" : "";
      this.emailExists = response.result;
    });
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

  openOrder(statusId) {
    this._datatablesService.model.StatusId = statusId;
    this._datatablesService.getDataTableRows();
  }
}
