import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild, QueryList, ViewChildren, ElementRef
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FlatpickrOptions, Ng2FlatpickrComponent } from "ng2-flatpickr";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "../../location/location.service";
import { HttpClient } from "@angular/common/http";
import { UploadAssetDocument, UploadAssetImages, Url } from "app/colors.const";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { OrderService } from "../order.service";
import { CommonService } from "app/common.service";
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2';
import { orderStatus } from "../order.module";
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from "flatpickr";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit {
  flatpickrInstance: flatpickr.Instance;
  selected_Assets: string[] = [];
  image_url = "";
  asset_data = [
    {
      assetID: "",
      barCodeID: "",
      assetName: "",
      conditionAtCheckOutID: "",
      returnDueDate: "",
      checkInDate: "",
      conditionAtCheckInID: "",
      orderHeaderID: "",
      barcodeImage: "",
      quantity: 0,
      assetItemType: "",
      inventoryQuantity: 0,
      error: "",
      location: "",
      serialNumber: "",
      locationID: ""
    },
  ];
  assets = [
    "Extension bar",
    "Impact Wrench",
    "Air ratchet",
    "Flex Head ratchet",
    "Automotive steth",
  ];
  conditions = ["Damaged", "New", "Missing Part"];
  locationList: any = { locationID: 0 };
  departmentList: any = { departmentId: 0 };
  statuslist: any = { statusId: 0 };
  categoryList: any = { categoryId: 0 };
  public asset_name = "";
  customerList: any = [];
  modelForm: any = { customerID: '', orderTypeID: '' };
  item: any = [];
  assetName = "";
  assetItem: any = [];
  message: boolean = false;
  conditionsList: any = {};
  orderStatusList: any = {};
  orderTypeList: any = {};
  images = [];
  checkAssetId = "";
  assetItemType = "";
  signPad: any;
  emailExists: boolean = false;
  checkPhonenumber = "";
  noExists: boolean = false;
  checkOutDate: string = null;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  signImage: any;
  checkoutDisableDate: any;
  checkoutDateReq: number = 0;
  assetConditionList: any = [];
  isSignPadRequired: boolean = false;
  isSignPadDraw: boolean = true;
  SignatureError: string = "";
  @ViewChildren(Ng2FlatpickrComponent) flatpickrs: QueryList<Ng2FlatpickrComponent>;
  fileUploadError: string = "";
  isFileValid: boolean = true;
  customerFileUploadError: string = "";
  isCustomerFileValid: boolean = true;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  conditiondropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;
  modelDetail: any = {};
  orderSubGridDetail: any = [];
  subAssetError: any = "";
  isCustomer: boolean = false;
  todayDate: any;
  colloectedValue: any;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  @ViewChildren('barCodeID', { read: ElementRef }) barCodeID: QueryList<ElementRef>;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private locationService: LocationService,
    private setting: FormBuilder,
    private coreLoadingScreenService: CoreLoadingScreenService,
    private _http: HttpClient, private router: Router, private _orderService: OrderService, private _commonService: CommonService
  ) { }

  public OrderDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: "d-m-Y",
    minDate: 'today'
  };

  public checkoutDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: "d-m-Y",
    minDate: 'today'
  };
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: "d-m-Y",
    minDate: 'today'
  };

  public ReturnDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: "d-m-Y"
  };
  onaddasset(existingRecord = null) {
    if (existingRecord == null)
      existingRecord = {
        assetID: "",
        barCodeID: "",
        assetName: "",
        conditionAtCheckOutID: "",
        returnDueDate: "",
        checkInDate: "",
        conditionAtCheckInID: "",
        orderHeaderID: "",
        barcodeImage: "",
        quantity: 0,
        assetItemType: "",
        inventoryQuantity: 0,
        error: "",
        location: "",
        serialNumber: "",
        locationID: ""
      };
    this.asset_data.push(existingRecord);
    setTimeout(() => {
      this.barCodeID.last.nativeElement.focus()
    }, 500)
  }
  ondelete(i) {
    if (this.asset_data.length > 1) {
      this.asset_data.splice(i, 1);
    }
  }

  onDateChange(event: any, row: any) {
    const returnDueDate = new Date(event.target.value);

    returnDueDate.setHours(returnDueDate.getHours() + 8);
    returnDueDate.setMinutes(returnDueDate.getMinutes() + 47);
    returnDueDate.setSeconds(returnDueDate.getSeconds() + 58);
    const returnDueformattedDate = this.formatDate(returnDueDate);

    const checkoutDate = new Date(this.modelForm.checkOutDate);
    const checkoutformattedDate = this.formatDate(checkoutDate);

    if (checkoutDate) {
      if ((checkoutformattedDate > returnDueformattedDate) && returnDueDate) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          width: 400,
          title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">Return Due Date must be or after Check Out Date</div>',
          showConfirmButton: false,
          timer: 5000,
          heightAuto: true
        })
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        width: 400,
        title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">Please enter a check out date First</div>',
        showConfirmButton: false,
        timer: 5000,
        heightAuto: true
      })
    }
  }

  formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.modelForm.statusId = 'Open';
      this.locationService.GetReferenceStatusList().subscribe((data: any) => {
        this.locationList = data.result.assetLocationList;
        this.departmentList = data.result.departmentList;
        this.statuslist = data.result.assetStatusList;
        this.assetConditionList = data.result.assetConditionList;
        this.categoryList = data.result.assetCategoryList;
      });
      this._orderService.GetConditionDetail().subscribe((response: any) => {
        if (response.length > 0) {
          this.conditionsList = response;
        }
      });
      this._orderService.GetOrderStatus().subscribe((response: any) => {
        if (response.length > 0) {
          this.orderStatusList = response;
        }
      });
      this._orderService.GetOrderTypeStatus().subscribe((response: any) => {
        if (response.length > 0) {
          this.orderTypeList = response;
        }
      });
      this._orderService.GetConfigurationApplication().subscribe((data: any) => {
        if (data.status) {
          this.application = data.result;
        }
      });
    });
    const newLocal = Url + 'api/Asset/GetAssetItem';
    this._http.get(newLocal).subscribe((data: any) => {
      if (data.result) {
        this.customerList = data.result.customerList;
      }
    })
    this.dropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.conditiondropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.selectedItems = [];
    this.dropDownForm = this.setting.group({
      myItems: [this.selectedItems],
      locationItems: [this.locationList],
      categoryItems: [this.categoryList],
    });
  }

  oncustomer_change(val) {
    if (val) {
      this._http.get(Url + 'api/Customer/' + val).subscribe((response: any) => {
        if (response.status) {
          this.image_url = response.result.customerImage;
        }
      });
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement.textContent = "";
      this.isCustomer = true;
      this.todayDate = new Date();
      this.colloectedValue = val;
      this.ngAfterViewInit();
      this.bindCheckoutDatePicker();
      this.ReturnDateOptions;
      this.modelForm.orderDate = new Date();
      this.modelForm.orderTypeID = '1';
      this.modelForm.collectedbyID = val;
      this.checkCheckOut(new Date());

    } else {
      this.image_url = "";
      this.isCustomer = false;
    }
  }
  modalOpenLG(modalLG) {
    this.modalService.open(modalLG, {
      centered: true,
      size: "lg",
    });
    this.checkAssetId = "";
    this.checkPhonenumber = "";
    this.images = [];
    const fileInput = document.getElementById("drap-picture") as HTMLInputElement;
    if (fileInput != null)
      fileInput.value = null;
  }

  Save() {
    var element = document.getElementById("btnSaveOrder");
    element.classList.add("spinner-loading");
    var tempList = this.asset_data;
    if (this.modelForm.checkOutDSZXGBate != '' && this.modelForm.checkOutDate != null)
      for (var i = 0; i < tempList.length; i++) {
        if (tempList[i].assetName != "" || tempList[i].barCodeID != "") {
          if (this.asset_data[0].assetName == "" || this.asset_data[0].barCodeID == "") {
            this.asset_data[0].error = "Id/Name is required";
            element.classList.remove("spinner-loading");
            return;
          }
          if (tempList[i].assetItemType != 'inventory') {
            if (tempList[i].returnDueDate[0] == undefined) {
              if (tempList[i].returnDueDate != null && new DatePipe('en-US').transform(tempList[i].returnDueDate, 'yyyy-MM-dd') < new DatePipe('en-US').transform(this.modelForm.checkOutDate, 'yyyy-MM-dd')) {
                this._commonService.simpleErrorAlertMethod(`Return date should be greater than checkout date for asset id ${tempList[i].barCodeID}`);
                element.classList.remove("spinner-loading");
                return;
              }
              if (tempList[i].returnDueDate == null || tempList[i].returnDueDate == '') {
                this._commonService.simpleErrorAlertMethod(`Please fill the return date for asset id ${tempList[i].barCodeID}`);
                element.classList.remove("spinner-loading");
                return;
              }
            }
            else {
              if (tempList[i].returnDueDate[0] != null && new DatePipe('en-US').transform(tempList[i].returnDueDate[0], 'yyyy-MM-dd') < new DatePipe('en-US').transform(this.modelForm.checkOutDate, 'yyyy-MM-dd')) {
                this._commonService.simpleErrorAlertMethod(`Return date should be greater than checkout date for asset id ${tempList[i].barCodeID}`);
                element.classList.remove("spinner-loading");
                return;
              }

              if (tempList[i].returnDueDate[0] == null || tempList[i].returnDueDate[0] == '' || tempList[i].returnDueDate == null || tempList[i].returnDueDate == '') {
                this._commonService.simpleErrorAlertMethod(`Please fill the return date for asset id ${tempList[i].barCodeID}`);
                element.classList.remove("spinner-loading");
                return;
              }
            }

            if (tempList[i].conditionAtCheckOutID[0] == null || tempList[i].conditionAtCheckOutID[0] == '') {
              this._commonService.simpleErrorAlertMethod(`Please fill the condition at checkOut Id for asset id ${tempList[i].barCodeID}`);
              element.classList.remove("spinner-loading");
              return;
            }
          }
          else {
            if (tempList[i].quantity == 0 || tempList[i].quantity == undefined || tempList[i].quantity < 0) {
              this._commonService.simpleErrorAlertMethod(`Please fill the quantity for inventory id ${tempList[i].barCodeID}`);
              element.classList.remove("spinner-loading");
              return;
            }
          }
        }
      }
    var orderUrl = Url + "api/Order/OredrHeader/Insert";
    if (this.asset_data.length > 0) {
      if (this.asset_data[0].assetName == "" || this.asset_data[0].barCodeID == "") {
        this.asset_data[0].error = "Id/Name is required";
        element.classList.remove("spinner-loading");
        return;
      }
      else {
        if (this.modelForm.checkOutDate == undefined || this.modelForm.checkOutDate == "") {
          this.modelForm.checkOutDate = null;
          this.modelForm.statusId = orderStatus.Open;
        }
        else {
          this.modelForm.checkOutDate = this.modelForm.checkOutDate;

          this.modelForm.isaAssetType = false;
          this.asset_data.forEach(element => {
            if (element.barCodeID != '' && element.assetName != '') {
              this.modelForm.isQtyEnable = element.assetItemType == 'inventory' ? false : true;
              if (this.modelForm.isQtyEnable) {
                this.modelForm.isaAssetType = true;
                return;
              }
              this.modelForm.quantity = element.quantity;
            }
          });
          if (this.modelForm.isaAssetType) {
            this.modelForm.statusId = orderStatus.Pending;
          }
          if (!this.modelForm.isQtyEnable && !this.modelForm.isaAssetType) {
            if (this.modelForm.quantity === 0 || this.modelForm.quantity === "") {
              this.modelForm.statusId = orderStatus.Open;
              return;
            }
            this.modelForm.statusId = orderStatus.Completed;
          }
          if ((this.modelForm.checkOutDate != undefined || this.modelForm.checkOutDate != "") && !this.modelForm.isQtyEnable) {
            this.modelForm.statusId = orderStatus.Completed;
          }
        }

        this.modelForm.collectedbyID = this.modelForm.collectedbyID || 0;
        this.modelForm.signatureLocation = this.signPad.toDataURL();
        this.modelForm.orderDate = this.modelForm.orderDate;
        this._http.post(orderUrl, this.modelForm).subscribe((data: any) => {
          let objFormData = new FormData();
          let objFormDocument = new FormData();
          if (data.result)
            objFormDocument.append('OrderHeaderID', data.result);
          let files = (<HTMLInputElement>document.getElementById('change-orderFile')).files.length;
          for (var i = 0; i < (<HTMLInputElement>document.getElementById('change-orderFile')).files.length; i++) {
            let file = (<HTMLInputElement>document.getElementById('change-orderFile')).files[i];
            objFormDocument.append('files', file, file.name);
          }
          this._http.post(Url + "api/Order/UploadOrderFile", objFormDocument).subscribe(() => {
          });
          var tempList = this.asset_data;
          for (var i = 0; i < tempList.length; i++) {
            if (tempList[i].barCodeID !== '' && tempList[i].assetName !== '') {
              tempList[i].assetID = tempList[i].barCodeID.split('.')[0];
              if (this.modelForm.checkOutDate != '' && this.modelForm.checkOutDate != null) {
                if (tempList[i].returnDueDate != undefined) {
                  var returnDate: any = this.addOneDay(tempList[i].returnDueDate);
                  var newretuendate: any = new Date(new Date().setDate(returnDate.getDate() - 1));
                  if (tempList[i].returnDueDate[0] != undefined) {
                    tempList[i].returnDueDate = tempList[i].returnDueDate[0];
                  }
                  else {
                    tempList[i].returnDueDate = tempList[i].returnDueDate;
                  }
                }
              }
              else {
                tempList[i].returnDueDate = null;
              }
              tempList[i].orderHeaderID = data.result;
              if (tempList[i].checkInDate == '') tempList[i].checkInDate = null;
              if (tempList[i].returnDueDate == '') tempList[i].returnDueDate = null;
              if (tempList[i].conditionAtCheckOutID == '') tempList[i].conditionAtCheckOutID = null;
              if (tempList[i].conditionAtCheckInID == '') tempList[i].conditionAtCheckInID = null;
              this.assetItem.push(tempList[i]);
            }
          }
          if (this.assetItem.length > 0) {
            this._http.post(Url + "api/Order/Insert", this.assetItem).subscribe(() => {

            });
          }
          this._commonService.simpleAlertMethod('Order has been Created', "/order/list");
          element.classList.remove("spinner-loading");
        })
      }
    }
  }

  addOneDay(date) {
    const originalDate = new Date(date);
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    return new Date(originalDate.getTime() + oneDay);
  }

  UploadImage(Obj) {
    const file = Obj.target.files[0]; const extensions = this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
    let size = "";
    if (file.type.includes("image")) {
      size = this.application.photosize;
    } else {
      size = this.application.maxAttachmentsize;
    }
    if (size) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > parseInt(size)) {
        this.customerFileUploadError = `File size must be less than ${size} kb`;
        this.isCustomerFileValid = false;
        return;
      }
    }
    if (extensions.length > 0 && !extensions.some(x => file.name.toLowerCase().endsWith(x))) {
      this.customerFileUploadError = `File must be of type ${this.application.fileExtensions}`;
      this.isCustomerFileValid = false;
      return;
    }
    this.isCustomerFileValid = true;
    this.customerFileUploadError = "";
    const reader = new FileReader();
    this.images = [];
    reader.onload = e => this.images.push(reader.result);
    reader.readAsDataURL(file);

  }

  GetAsset(event, asset, checkExists = true) {
    var barcodelist: any = [];
    asset.assetName = "";
    asset.error = "";
    asset.quantity = 0;
    asset.errorQuantity = "";
    asset.location = "";
    asset.serialNumber = "";
    if (event.which == 13) {
      if (asset != null) {
        this._http.get(Url + 'api/Order/ExistAssetId/' + asset.barCodeID).subscribe((data: any) => {
          if (data.status && data.result.isNotExist) {
            this._http.get(Url + 'api/Asset/GetAssetItemDetail/' + asset.barCodeID).subscribe((response: any) => {
              if (response.status) {
                if (response.result.status == "NotActive") {
                  asset.error = "Asset/Inventory is Not Active";
                  return;
                }
                if (response.result.status == "Unavailable") {
                  asset.error = "Asset/Inventory is Unavailable";
                  return;
                }
                barcodelist = this.asset_data;
                let exists: number = 0;
                this.asset_data.forEach(element => {
                  if (element.barCodeID != "" && element.barCodeID == response.result.barCodeID) {
                    exists++;
                  }
                });
                if (checkExists && exists > 1) {
                  asset.error = "Item exist!!";
                  return;
                }
                else if (!checkExists && exists > 0) {
                  asset.error = "Item exist!!";
                  return;
                }
                else {
                  asset.locationID = response.result.locationID;
                  asset.location = response.result.location;
                  asset.serialNumber = response.result.serialNumber;
                  asset.assetName = response.result.assetName;
                  asset.barCodeID = response.result.barCodeID;
                  asset.isQtyEnable = data.result.itemType == 'inventory' ? false : true;
                  asset.isCondition = data.result.itemType == 'inventory' ? true : false;
                  asset.assetItemType = data.result.itemType;
                  asset.inventoryQuantity = data.result.quantity;
                  if (asset.isQtyEnable) {
                    asset.returnDueDate = new Date();
                  }
                  if (asset.isQtyEnable) {
                    asset.quantity = 1;
                  }
                  if (!checkExists) {
                    this.onaddasset(asset);
                  }
                  else
                    this.onaddasset();
                }
              }
              else {
                asset.error = "Asset Id not found!!";
                return;
              }
            });
          }
          else {
            asset.error = "Item exist on Order ID " + data.result.orderID;
            return;
          }
        });
      }
    }
  }
  simpleAlert() {
    Swal.fire("Customer", 'you submitted successfully', 'success')
  }
  SaveCustomer(form: NgForm) {
    var element = document.getElementById("btnSaveCustomer");
    element.classList.add("spinner-loading");
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
    objFormData.append('PhoneNumber', result.phoneNumber != null && result.phoneNumber != undefined ? result.phoneNumber : '');
    objFormData.append('Email', result.email);
    objFormData.append('DepartmentId', result.departmentId);
    objFormData.append('StatusId', result.statusId);
    objFormData.append('Comments', result.comments != null ? result.comments : "");
    objFormData.append('LocationId', result.locationId);
    this._orderService.AddCustomerList(objFormData).subscribe((response: any) => {
      if (response.status) {
        var objListItem = {
          value: response.result.id,
          text: response.result.firstName + ' ' + response.result.lastName
        }
        this.customerList.push(objListItem);
        this._orderService.GetLocation().subscribe((data: any) => {
          if (data.result) {
            this.customerList = data.result.customerList;
          }
        })
        element.classList.remove("spinner-loading");
        this._commonService.simpleAlertMethod('Customer has been added');
        this.modalService.dismissAll();
      }
    });

  }
  keyPressText(event) {
    this._commonService.keyPressAlphaNumericWithCharacters(event);
  }
  keyPressNumber(event) {
    this._commonService.validNumbers(event);
  }
  printBarCode(asset, i) {
    asset.barCodeID = "";
    asset.assetName = "";
    this.checkAssetId = "";
    asset.error = "";
    asset.quantity = 0;
    asset.errorQuantity = "";
    let objFormData = new FormData();
    let files = (<HTMLInputElement>document.getElementById('upload-picture' + i)).files.length;
    let file = (<HTMLInputElement>document.getElementById('upload-picture' + i)).files[files - 1];
    objFormData.append('Imagefiles', file, file.name);
    this._http.post(Url + 'api/Order/ReadBarcode', objFormData).subscribe((response: any) => {
      if (response.status) {
        this._http.get(Url + 'api/Order/ExistAssetId/' + response.result[0].assetId).subscribe((data: any) => {
          if (data.status && data.result.isNotExist) {
            let exists: boolean = false;
            this.asset_data.forEach(element => {
              if (element.barCodeID != "" && element.barCodeID == response.result[0].assetId) {
                exists = true;
              }
            });
            if (exists) {
              if (data.result.orderID != null) {
                asset.error = "Item exist on Order ID" + data.result.orderID;
              }
              else {
                asset.error = "Item already exist."
              }
            }
            else {
              asset.assetName = response.result[0].assetName;
              asset.barCodeID = response.result[0].assetId;
            }
          }
          else {
            if (data.result.orderID != null) {
              asset.error = "Item exist on Order ID " + data.result.orderID;
            }
            else {
              asset.error = "Item already exist.";
            }
          }
        });
      }
    });

  }
  GetAssets(asset) {
    asset.assetName = "";
    asset.error = "";
    var barcodeId = asset.barCodeID;
    if (asset != null) {
      this._http.get(Url + 'api/Asset/GetAssetItemDetail/' + barcodeId).subscribe((response: any) => {
        if (response.status) {
          this._http.get(Url + 'api/Order/ExistAssetId/' + barcodeId).subscribe((data: any) => {
            if (data.status) {
              let exists: boolean = false;
              this.asset_data.forEach(element => {
                if (element.barCodeID != "" && element.barCodeID == barcodeId) {
                  exists = true;
                }
              });
              if (exists) {
                asset.assetName = response.result.assetName;
              }
              else {
                asset.error = "Already added!!";
              }
            }
            else {
              asset.error = "Already exist!!";
            }
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);

    this.bindCheckoutDatePicker();
    flatpickr("#orderDate", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: this.isCustomer ? 'today' : null,

      onChange: function (dateStr, dateObj) {
        if (dateObj) {
          var checkoutDate: any;
          checkoutDate = document.getElementById('checkoutDate');
          if (new Date(dateObj) > new Date(checkoutDate.value)) {
            flatpickr("#checkoutDate", {
              altInput: true,
              altFormat: "d-m-Y",
              minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd')
            });
          } else {
            flatpickr("#checkoutDate", {
              altInput: true,
              altFormat: "d-m-Y",
              defaultDate: checkoutDate.value,
              minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd')
            });
          }
        }
      },
      onClose: function (selectedDates, dateStr, instance) {
        const errorMessageElement = document.getElementById("error-message");
        if (dateStr != null && dateStr != undefined && dateStr != '') {
          errorMessageElement.textContent = "";
        }
        else {
          errorMessageElement.textContent = "Order Date is required";
        }
      }
    });
  }

  clearCheckoutDate() {
    this.checkoutDateReq = 0;
    this.isSignPadRequired = false;
    this.isSignPadDraw = true;
    this.SignatureError = "";
    var checkoutDate: any;
    checkoutDate = document.getElementById('checkoutDate');
    checkoutDate.value = '';
    var returnDueElements = document.getElementsByClassName("returnDue");
    for (let i = 0; returnDueElements.length > i; i++) {
      var returnDueDate: any;
      returnDueDate = returnDueElements[i];
      returnDueDate.value = '';
      this.asset_data[i].returnDueDate = '';
    }
    this.modelForm.checkOutDate = null;
    this.bindCheckoutDatePicker();
  }

  bindCheckoutDatePicker() {
    flatpickr("#checkoutDate", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: this.isCustomer ? 'today' : null,
      minDate: this.modelForm.orderDate,
      onChange: function (dateStr, dateObj) {
        if (!dateObj) {
          return;
        }
        if (dateObj) {
          var orderdate: any;
          orderdate = document.getElementById('orderDate');
          if (orderdate.value == null || orderdate.value == "") {
            Swal.fire({
              position: 'center',
              icon: 'error',
              width: 400,
              title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">Please enter Order Date first</div>',
              showConfirmButton: false,
              timer: 5000,
              heightAuto: true,
            })
            this.clear();
          }
        }
      }
    });
  }

  destroyFlatpickr() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = null;
    }
  }

  /*It's work in devices*/
  startSignPadDrawing(event: Event) {
  }
  /*It's work in devices*/
  movedFinger(event: Event) {
  }
  mySignPadDrawing() {
    this.isSignPadDraw = true;
    this.SignatureError = "";
    this.emailExists = false;
  }
  /*Undo last step from the signature*/
  undoSign() {
    const data = this.signPad.toData();
    if (data) {
      data.pop(); // remove the last step
      this.signPad.fromData(data);
    }
  }
  /*Clean whole the signature*/
  clearSignPad() {
    this.signPad.clear();
    this.isSignPadDraw = false;
    this.SignatureError = "Signature is required";
    this.emailExists = true;
  }
  /*Here you can save the signature as a Image*/
  saveSignPad() {
    const base64ImageData = this.signPad.toDataURL();
    this.signImage = base64ImageData;
    //Here you can save your signature image using your API call.
  }
  getInventoryQuantity(event, asset) {
    asset.errorQuantity = "";
    if (asset.quantity > asset.inventoryQuantity) {
      asset.errorQuantity = "Available stock in inventory " + asset.inventoryQuantity;
      asset.quantity = 0;
    }
  }

  getEmail(email) {
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/Customer/ExistCustomerEmail/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "Email Address already exist";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
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
  changeCheckOut(event) {
    if (event.target.value != '') {
      this.modelForm.checkOutDate = event.target.value;
      this.checkoutDateReq = 1;
      this.isSignPadRequired = true;
      this.signPad._data.length > 0 ? this.isSignPadDraw = true : this.isSignPadDraw = false, this.SignatureError = "";
    }
    else {
      this.checkoutDateReq = 0;
      this.isSignPadRequired = false;
      this.isSignPadDraw = true;
      this.SignatureError = "";
    }
    var dates: string[];
    dates = this.asset_data.filter(x => x.returnDueDate != null).map(x => x.returnDueDate[0])
    if (event.target.value && this.checkIfAnyDateIsSmaller(dates, event.target.value)) {
      this.clearAllPickers();
      return;
    }
  }

  checkIfAnyDateIsSmaller(dateList: string[], targetDate: string): boolean {
    return dateList.some(date => new Date(date) < new Date(targetDate));
  }

  clearAllPickers() {
    var pickers: any = {};
    pickers = this.flatpickrs;
    pickers._results.forEach(flatpickr =>
      flatpickr.flatpickr.clear() && flatpickr.flatpickr.destroy() && flatpickr.flatpickr.redraw()
    );
  }

  FileUpload(e) {
    const files = e.target.files;
    const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
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
    }
    this.isFileValid = true;
    this.fileUploadError = "";
  }
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.text.toLocaleLowerCase().indexOf(term) > -1 ||
      item.value.toLocaleLowerCase().indexOf(term) > -1;
  }

  submitSubDetail() {
    this.coreLoadingScreenService.showLoader("btnsubmitSubDetail");
    this.selected_Assets = [];
    this.modelDetail.itemCategory = this.modelDetail.itemCategory != undefined ? this.modelDetail.itemCategory.map(function (e) { return e.text; }) : null;
    this.modelDetail.location = this.modelDetail.location != undefined ? this.modelDetail.location.map(function (e) { return e.text; }) : null;
    this.modelDetail.assetName = this.modelDetail.assetName != null ? this.modelDetail.assetName : null;

    this.modelDetail.serialNumber = this.modelDetail.serialNumber || null;
    if (this.modelDetail.serialNumber === "") {
      this.modelDetail.serialNumber = null;
    }
    this.modelDetail.assetNumber = this.modelDetail.assetNumber || null;
    if (this.modelDetail.assetNumber === "") {
      this.modelDetail.assetNumber = null;
    }

    if (Array.isArray(this.modelDetail.itemCategory) && this.modelDetail.itemCategory.length === 0) {
      this.modelDetail.itemCategory = null;
    }
    if (Array.isArray(this.modelDetail.location) && this.modelDetail.location.length === 0) {
      this.modelDetail.location = null;
    }
    if (this.modelDetail.assetName == "") {
      this.modelDetail.assetName = null;
    }
    this._orderService.SearchSubOrderDetail(this.modelDetail).subscribe((response: any) => {
      if (response.status) {
        if (response.result.length > 0) {
          this.orderSubGridDetail = response.result;
        }
        else {
          this.orderSubGridDetail = [];
          Swal.fire("", 'No Results found', 'error');
        }
      }
      else {
        this.orderSubGridDetail = [];
        Swal.fire("", 'No Results found', 'error');
      }
      this.coreLoadingScreenService.hideLoader("btnsubmitSubDetail");
    });
  }

  resetSubDetail() {
    this.modelDetail = {};
    this.selected_Assets = [];
    this._orderService.SearchSubOrderDetail(this.modelDetail).subscribe((response: any) => {
      if (response.status) {
        this.orderSubGridDetail = response.result;
      }
      else {
        this.orderSubGridDetail = [];
      }
    });
  }
  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  populateResult(event: any) {
    this._http.get(Url + 'api/Order/ExistAssetId/' + event.srcElement.value).subscribe((data: any) => {
      if (data.status && data.result.isNotExist) {
        this._http.get(Url + 'api/Asset/GetAssetItemDetail/' + event.srcElement.value).subscribe((response: any) => {
          if (response.status) {
            if (response.result.status == "NotActive") {
              event.srcElement.checked = false;
              this.subAssetError = "Asset/Inventory is Not Active";
              Swal.fire("", this.subAssetError, 'error');
              return;
            }
            if (response.result.status == "Unavailable") {
              event.srcElement.checked = false;
              this.subAssetError = "Asset/Inventory is Unavailable";
              Swal.fire("", this.subAssetError, 'error');
              return;
            }
          }
          else {
            event.srcElement.checked = false;
            this.subAssetError = "Asset Id not found!!";
            Swal.fire("", this.subAssetError, 'error');
            return;
          }
        });
      }
      else {
        event.srcElement.checked = false;
        this.subAssetError = "Item exist on Order ID " + data.result.orderID;
        Swal.fire("", this.subAssetError, 'error');
        return;
      }
    });

    if (event.currentTarget.checked) {
      this.selected_Assets.push(event.srcElement.value);
    }
    else {
      let Index = this.selected_Assets.indexOf(event.srcElement.value);
      if (Index > -1) {
        this.selected_Assets.splice(Index, 1);
      }
    }
  }
  populateTable() {
    if (this.asset_data.length > 0 && this.selected_Assets.length > 0)
      for (var i = 0; i < this.asset_data.length; i++) {
        if (this.asset_data[i].barCodeID == null || this.asset_data[i].barCodeID == "") {
          this.asset_data.splice(i, 1);
          i--;
        }
      };
    this.selected_Assets.forEach(element => {
      let event = { which: 13 };
      let asset = {
        barCodeID: element,
      };
      this.GetAsset(event, asset, false);
    });
    this.modalService.dismissAll();
    this.selected_Assets = [];
  }

  checkCheckOut(event) {
    if (event != '') {
      this.modelForm.checkOutDate = event;
      this.checkoutDateReq = 1;
      this.isSignPadRequired = true;
      this.signPad._data.length > 0 ? this.isSignPadDraw = true : this.isSignPadDraw = false, this.SignatureError = "";
    }
    else {
      this.checkoutDateReq = 0;
      this.isSignPadRequired = false;
      this.isSignPadDraw = true;
      this.SignatureError = "";
    }
    var dates: string[];
    dates = this.asset_data.filter(x => x.returnDueDate != null).map(x => x.returnDueDate[0])
    if (event && this.checkIfAnyDateIsSmaller(dates, event)) {
      this.clearAllPickers();
      return;
    }
  }
}