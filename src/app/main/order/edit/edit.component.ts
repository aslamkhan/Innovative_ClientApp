import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'ng2-flatpickr';
import { orderStatus } from '../order.module';
import { OrderService } from '../order.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from "flatpickr";
import SignaturePad from 'signature_pad';
import { LocationService } from 'app/main/location/location.service';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
const moment = require('moment');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditComponent implements OnInit {
  image_url = "assets/images/avatar/2.png";
  asset_data = [{
    id: "",
    assetID: "",
    assetName: "",
    conditionAtCheckOutID: "",
    returnDueDate: "",
    checkInDate: "",
    conditionAtCheckInID: "",
    orderHeaderID: "",
    barCodeID: "",
    quantity: "",
    assetItemType: "",
    inventoryQuantity: 0,
    location: "",
    serialNumber: "",
    locationID: ""
  }]
  assets = ["Extension bar", "Impact Wrench", "Air ratchet", "Flex Head ratchet", "Automotive steth"];
  conditions = ["Damaged", "New", "Missing Part"]
  public asset_name = "";
  model: any = {};
  modelForm: any = {};
  customerList: any = [];
  orderDetail: any = [];
  documentFile = [];
  customerDetail: any = {};
  conditionsList: any = [];
  orderStatusList: any = [];
  orderTypeList: any = [];
  checkAssetId = "";
  subOrderDetail: any = [];
  assetIndex: any;
  signPad: any;
  signatureLocation: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  signImage: any;
  checkoutDateReq: number = 0;
  collectedDisable: number = 0;
  isSignPadRequired: boolean = false;
  isSignPadDraw: boolean = true;
  SignatureError: string = "";
  @ViewChildren(Ng2FlatpickrComponent) flatpickrs: QueryList<Ng2FlatpickrComponent>;
  fileUploadError: string = "";
  isFileValid: boolean = true;
  locationList: any = { locationID: 0 };
  categoryList: any = { categoryId: 0 };
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  conditiondropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;
  modelDetail: any = {};
  orderSubGridDetail: any = [];
  subAssetError: any = "";
  selected_Assets: string[] = [];
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  constructor(private modalService: NgbModal, private _orderService: OrderService, private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService, private locationService: LocationService, private setting: FormBuilder) { }
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y',
  };
  public ReturnDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: "d-m-Y"
  };

  ngOnInit(): void {
    this._orderService.GetAssetItems().subscribe((data: any) => {
      if (data.status) {
        this.customerList = data.result.customerList;
        this.locationList = data.result.assetLocationList;;
        this.categoryList = data.result.assetCategoryList;;
      }
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._orderService.GetByIdOrderItems(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.modelForm = data.result;
            this.bindFlatPickr(this.modelForm.orderDate, this.modelForm.checkOutDate);
            if (this.modelForm.checkOutDate != null) {
              this.isSignPadRequired = true;
              this.SignatureError = "";
              this.isSignPadDraw = this.modelForm.signatureLocation != '' ? true : false;
              this.signatureLocation = this.modelForm.signatureLocation;
            }
            if (data.result.orderdetails != null) {
              this.orderDetail = data.result.orderdetails;
              this.orderDetail.forEach(element => {
                element.isQtyEnable = element.itemType == 'inventory' ? false : true;
                element.isCondition = element.itemType == 'inventory' ? true : false;
              });
            }
            if (data.result.orderFile != null) {
              data.result.orderFile.forEach(element => {
                this.documentFile.push(element);
              });
            }
            if (data.result.customers != null) {
              this.customerDetail = data.result.customers;
            }
          }
        })
        this._orderService.GetConfigurationApplication().subscribe((data: any) => {
          if (data.status) {
            this.application = data.result;
          }
        });
      });

    this.locationService.GetReferenceStatusList().subscribe((data: any) => {
      this.conditionsList = data.result.assetConditionList;
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

  bindFlatPickr(orderDate: string, checkoutDate: string) {
    flatpickr("#checkoutDate", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: checkoutDate,
      minDate: orderDate,
      onChange: function (dateStr, dateObj) {
        if (dateStr[0] != null && dateStr[0] != undefined) {
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
          }
        }
      }
    });

    flatpickr("#orderDate", {
      altInput: true,
      altFormat: "d-m-Y",
      defaultDate: orderDate,
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

  onaddasset(existingRecord = null) {
    if (existingRecord == null)
      existingRecord = {
        id: "",
        assetID: "",
        assetName: "",
        conditionAtCheckOutID: "",
        returnDueDate: "",
        checkInDate: "",
        conditionAtCheckInID: "",
        orderHeaderID: "",
        barCodeID: "",
        barcodeImage: "",
        quantity: "",
        assetItemType: "",
        inventoryQuantity: 0,
        location: "",
        serialNumber: "",
        locationID: ""
      };
    this.orderDetail.push(existingRecord);

    //this.asset_data.push(existingRecord);
  }

  ondelete(i, e) {
    if (this.orderDetail.length > 1) {
      if (e.id) {
        this._http.delete(Url + 'api/Order/OrderDetails/' + e.id).subscribe((data: any) => {
          this.orderDetail.splice(i, 1);
        })
      } else {
        this.orderDetail.splice(i, 1);
      }
    }
  }

  modalOpenLG(modalLG) {
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  oncustomer_change(val) {
    if (val) {
      this.image_url = 'assets/images/avatar/2.png';
    } else {
      this.image_url = "";
    }
  }
  modalOpenview(modalLG, id) {
    this._http.get(Url + 'api/Order/OrderAssetDetails/' + id).subscribe((response: any) => {
      if (response.status) {
        this.subOrderDetail = response.result;
      }
    });
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  GetAsset(event, asset, checkExists = true) {
    var barcodelist: any = [];
    asset.assetName = "";
    asset.error = "";
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
                barcodelist = this.orderDetail;
                let exists: number = 0;
                this.orderDetail.forEach(element => {
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
                  asset.location = response.result.location;
                  asset.serialNumber = response.result.serialNumber;
                  asset.assetName = response.result.assetName;
                  asset.barCodeID = response.result.barCodeID;
                  asset.isQtyEnable = data.result.itemType == 'inventory' ? false : true;
                  asset.isCondition = data.result.itemType == 'inventory' ? true : false;
                  asset.inventoryQuantity = data.result.quantity;
                  if (asset.isQtyEnable) {
                    asset.quantity = 1;
                  }
                  if (!checkExists) {
                    this.onaddasset(asset);
                  }
                  else
                    this.onaddasset();
                }
                return;
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

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    var orderUrl = "";
    orderUrl = Url + "api/Order/UpdateHeader";
    if (this.modelForm.checkOutDate == undefined || this.modelForm.checkOutDate == null) {
      this.modelForm.checkOutDate = null;
      this.modelForm.statusId = orderStatus.Open;
      this.modelForm.signatureLocation = null;
    }
    else {
      if (this.modelForm.orderStatus == "Pending" || this.modelForm.orderStatus == "Open") {
        const checkOutDate = moment(this.modelForm.checkOutDate);

        for (let i = 0; i < this.orderDetail.length; i++) {
          const order = this.orderDetail[i];
          const barCodeID = order.barCodeID;
          const returnDueDate = order.returnDueDate != undefined && typeof order.returnDueDate != 'string' ? moment(order.returnDueDate[0]) : typeof order.returnDueDate != 'string' ? moment(null) : moment(order.returnDueDate);
          const checkinDate = order.checkInDate != undefined && typeof order.checkInDate != 'string' ? moment(order.checkInDate[0]) : typeof order.checkInDate != 'string' ? moment(null) : moment(order.checkInDate);

          if (order.itemType != 'inventory') {
            const checkoutDate = new Date(checkOutDate);
            const checkoutformattedDate = this.formatDate(checkoutDate);

            const newreturnDueDate = new Date(returnDueDate);
            const returnformattedDate = this.formatDate(newreturnDueDate);


            if (returnDueDate.isValid() && checkoutformattedDate > returnformattedDate) {
              this._commonService.simpleErrorAlertMethod(`Return date should be greater than checkout date for asset id ${barCodeID}`);
              this.coreLoadingScreenService.hideLoader("btnSave");
              return;
            }
            if (order.conditionAtCheckOutID == undefined || order.conditionAtCheckOutID == null || order.conditionAtCheckOutID == '') {
              this._commonService.simpleErrorAlertMethod(`Please fill the condition at checkOut Id for asset id ${barCodeID}`);
              this.coreLoadingScreenService.hideLoader("btnSave");
              return;
            }
            if (order.returnDueDate == undefined || order.returnDueDate == null || order.returnDueDate == '') {
              this._commonService.simpleErrorAlertMethod(`Please fill the return date for asset id ${barCodeID}`);
              this.coreLoadingScreenService.hideLoader("btnSave");
              return;
            }
            if (checkinDate.isValid()) {
              const checkoutDate = new Date(checkOutDate);
              const checkoutformattedDate = this.formatDate(checkoutDate);

              const newCheckinDate = new Date(checkinDate);
              const checkinformattedDate = this.formatDate(newCheckinDate);

              if (checkinDate.isValid() && checkoutformattedDate > checkinformattedDate) {//(checkinDate._d.toLocaleDateString() < returnDueDate._d.toLocaleDateString())) {
                this._commonService.simpleErrorAlertMethod(`Checkin date should be greater than or equal to Check Out Date for asset id ${barCodeID}`);
                this.coreLoadingScreenService.hideLoader("btnSave");
                return;
              }
              if (order.conditionAtCheckInID == undefined || order.conditionAtCheckInID == null || order.conditionAtCheckInID == '') {
                this._commonService.simpleErrorAlertMethod(`Please fill the condition at checkIn Id for asset id ${barCodeID}`);
                this.coreLoadingScreenService.hideLoader("btnSave");
                return;
              }
            }
          }
          else {
            if (order.quantity == '0' || order.quantity == '' || order.quantity < 0) {
              this._commonService.simpleErrorAlertMethod(`Please fill the quantity for inventory id ${barCodeID}`);
              this.coreLoadingScreenService.hideLoader("btnSave");
              return;
            }
          }
        }

      }
      if (this.modelForm.checkOutDate.length == 1) {
        this.modelForm.checkOutDate = this.modelForm.checkOutDate[0];
      }
      if (this.modelForm.checkOutDate.length == 0) {
        this.modelForm.checkOutDate = null;
      }
      if (this.modelForm.orderStatus == "Open") {
        this.modelForm.signatureLocation = this.signPad.toDataURL();
      }
      else {
        this.modelForm.signatureLocation = null;
      }
      this.modelForm.isAssetType = false;
      this.modelForm.isCheckOutNull = false;
      this.orderDetail.forEach(element => {
        if (element.barCodeID != '' && element.assetName != '') {
          this.modelForm.isQtyEnable = element.itemType == 'inventory' ? false : true;
          if (this.modelForm.isQtyEnable) {
            this.modelForm.isAssetType = true;
          }
          if (this.modelForm.isAssetType) {
            if (element.checkInDate == null && element.itemType == 'asset') {
              this.modelForm.isCheckOutNull = true;
            }
          }
        }
      });
      if (this.modelForm.isAssetType) {
        if (this.modelForm.isCheckOut) {
          this.modelForm.statusId = orderStatus.Pending;
        }
        else if (this.modelForm.isCheckOutNull) {
          this.modelForm.statusId = orderStatus.Pending;
        }
        else {
          this.modelForm.statusId = orderStatus.Completed
        }
      }
      if (!this.modelForm.isQtyEnable && !this.modelForm.isAssetType) {
        this.modelForm.statusId = orderStatus.Completed;
      }
    }

    if (this.modelForm.orderDate.length == 1) {
      this.modelForm.orderDate = this.modelForm.orderDate[0];
    }
    this.modelForm.orderTypeID = this.modelForm.orderTypeID;
    this.modelForm.collectedbyID = this.modelForm.collectedbyID || 0;
    this.modelForm.orderdetails = null;
    this._http.post(orderUrl, this.modelForm).subscribe((data: any) => {
      let objFormDocument = new FormData();
      let assetItem: any = [];
      if (data.result)
        objFormDocument.append('OrderHeaderID', data.result);
      let files = (<HTMLInputElement>document.getElementById('change-orderFile')).files.length;
      for (var i = 0; i < (<HTMLInputElement>document.getElementById('change-orderFile')).files.length; i++) {
        let file = (<HTMLInputElement>document.getElementById('change-orderFile')).files[i];
        objFormDocument.append('files', file, file.name);
      }
      this._http.post(Url + "api/Order/UploadOrderFile", objFormDocument).subscribe(() => {
      });
      for (var i = 0; i < this.orderDetail.length; i++) {
        if (this.orderDetail[i].barCodeID !== '' && this.orderDetail[i].assetName !== '') {
          this.orderDetail[i].assetID = this.orderDetail[i].barCodeID.split('.')[0];
          if (this.modelForm.checkOutDate == undefined || this.modelForm.checkOutDate == null) {
            this.orderDetail[i].returnDueDate = null;
          }
          else {
            if (this.orderDetail[i].returnDueDate == null || this.orderDetail[i].returnDueDate == "") {
              this.orderDetail[i].returnDueDate = null;
            }
            else {
              if (this.orderDetail[i].returnDueDate.length == 1) {
                var returnDate: any = this.addOneDay(this.orderDetail[i].returnDueDate);
                this.orderDetail[i].returnDueDate = this.orderDetail[i].returnDueDate[0];//returnDate;//this.orderDetail[i].returnDueDate[0];
              }
              else {
                this.orderDetail[i].returnDueDate = this.orderDetail[i].returnDueDate;
              }
            }
          }
          if (this.orderDetail[i].checkInDate == null || this.orderDetail[i].checkInDate == "") {
            this.orderDetail[i].checkInDate = null;
            this.orderDetail[i].statusId = orderStatus.Pending;
          }
          else {
            if (this.orderDetail[i].checkInDate.length == 1) {
              var checkInDate: any = this.addOneDay(this.orderDetail[i].checkInDate);
              this.orderDetail[i].checkInDate = this.orderDetail[i].checkInDate[0];
              this.orderDetail[i].statusId = orderStatus.Completed;
            }
          }
          if (this.orderDetail[i].locationID == "" || this.orderDetail[i].locationID == null) this.orderDetail[i].locationID = 0;
          if (this.orderDetail[i].conditionAtCheckInID == "" || this.orderDetail[i].conditionAtCheckInID == null) this.orderDetail[i].conditionAtCheckInID = 0;
          if (this.orderDetail[i].conditionAtCheckOutID == "" || this.orderDetail[i].conditionAtCheckOutID == null) this.orderDetail[i].conditionAtCheckOutID = 0;
          this.orderDetail[i].orderHeaderID = data.result;
          this.orderDetail[i].barCodeID = this.orderDetail[i].barCodeID;
          this.orderDetail[i].assetName = this.orderDetail[i].assetName;
          if (this.orderDetail[i].id == "") this.orderDetail[i].id = 0;
          if (this.orderDetail[i].quantity == "") this.orderDetail[i].quantity = 0;
          assetItem.push(this.orderDetail[i]);
        }
      }
      this._http.post(Url + "api/Order/Update", assetItem).subscribe((data: any) => {
        this.coreLoadingScreenService.hideLoader("btnSave");
        this._commonService.simpleAlertMethod('Order has been Updated', "/order/list");
      });
    })
  }

  addOneDay(date) {
    const originalDate = new Date(date);
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    return new Date(originalDate.getTime() + oneDay);
  }

  keyPressText(event) {
    this._commonService.keyPressAlphaNumericWithCharacters(event);
  }
  keyPressNumber(event) {
    this._commonService.validNumbers(event);
  }
  getInventoryQuantity(event, asset) {
    asset.errorQuantity = "";
    if (asset.quantity > asset.inventoryQuantity) {
      asset.errorQuantity = "Available stock in inventory " + asset.inventoryQuantity;
      asset.quantity = 0;
    }
  }

  updateCheckinDate(id) {
    this.assetIndex = id;
  }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);

    this.bindCheckoutDatePicker();

    flatpickr("#orderDate", {
      altInput: true,
      altFormat: "d-m-Y",
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

  bindCheckoutDatePicker() {
    flatpickr("#checkoutDate", {
      altInput: true,
      altFormat: "d-m-Y",
      minDate: this.modelForm.orderDate,
      onChange: function (dateStr, dateObj) {
        if (!dateObj) {
          return;
        }
        if (dateStr[0] != null && dateStr[0] != undefined) {
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
            this.close();
            return;
          }
        }
      }
    });
  }

  clearAllPickers() {
    var pickers: any = {};
    pickers = this.flatpickrs;
    pickers._results.forEach(flatpickr =>
      flatpickr.flatpickr.clear() && flatpickr.flatpickr.destroy() && flatpickr.flatpickr.redraw()
    );
  }

  clearCheckoutDate() {
    this.checkoutDateReq = 0;
    this.isSignPadRequired = false;
    this.isSignPadDraw = true;
    this.SignatureError = "";
    var checkoutDate: any;
    checkoutDate = document.getElementById('checkoutDate');
    checkoutDate.value = '';
    this.bindCheckoutDatePicker();
  }

  /*It's work in devices*/
  startSignPadDrawing(event: Event) {
  }
  /*It's work in devices*/
  movedFinger(event: Event) {
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
  }
  /*Here you can save the signature as a Image*/
  saveSignPad() {
    const base64ImageData = this.signPad.toDataURL();
    this.signImage = base64ImageData;
    //Here you can save your signature image using your API call.
  }
  changeCheckOut(event) {
    if (event.target.value != '') {
      this.checkoutDateReq = 1;
      this.isSignPadRequired = true;
      this.collectedDisable = 1;
      this.signPad._data.length > 0 ? this.isSignPadDraw = true : this.isSignPadDraw = false, this.SignatureError = "";
    } else {
      this.checkoutDateReq = 0;
      this.isSignPadRequired = false;
      this.collectedDisable = 0;
      this.isSignPadDraw = true;
      this.SignatureError = "";
    }
    if (this.modelForm.collectedbyID != 0) {
      this.checkoutDateReq = 0;
    }
    var dates: string[];
    dates = this.orderDetail.filter(x => x.returnDueDate != null).map(x => x.returnDueDate[0])
    if (event.target.value && this.checkIfAnyDateIsSmaller(dates, event.target.value)) {
      this.clearAllPickers();
      return;
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
      if ((checkoutformattedDate > returnDueformattedDate)) {
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

  checkIfAnyDateIsSmaller(dateList: string[], targetDate: string): boolean {
    return dateList.some(date => new Date(date) < new Date(targetDate));
  }

  changeCollectedBy(event) {
    if (event.target.value != '') {
      this.checkoutDateReq = 0;
      this.isSignPadRequired = true;
      if (this.signPad._data.length > 0) {
        this.isSignPadDraw = true
      } else {
        this.isSignPadDraw = false;
        this.SignatureError = "Signature is required";
      }
    } else {
      this.checkoutDateReq = 1;
      this.isSignPadDraw = true;
      this.SignatureError = "";
    }
  }
  mySignPadDrawing() {
    this.isSignPadDraw = true;
    this.SignatureError = "";
  }
  fileDownload(obj) {
    this._orderService.DownloadFile(obj.id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    });
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
    this.selected_Assets = [];
    this.modelDetail.itemCategory = this.modelDetail.itemCategory != undefined ? this.modelDetail.itemCategory.map(function (e) { return e.text; }) : null;
    this.modelDetail.location = this.modelDetail.location != undefined ? this.modelDetail.location.map(function (e) { return e.text; }) : null;
    this.modelDetail.assetName = this.modelDetail.assetName != null ? this.modelDetail.assetName : null;

    this.modelDetail.serialNumber = this.modelDetail.serialNumber || null;
    if (this.modelDetail.serialNumber === "") {
      this.modelDetail.serialNumber = null;
    }
    this.modelDetail.assetNumber = this.modelDetail.assetNumber || 0;
    if (this.modelDetail.assetNumber === "") {
      this.modelDetail.assetNumber = 0;
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
    if (this.orderDetail.length > 0 && this.selected_Assets.length > 0)
      for (var i = 0; i < this.orderDetail.length; i++) {
        if (this.orderDetail[i].barCodeID == null || this.orderDetail[i].barCodeID == "") {
          this.orderDetail.splice(i, 1);
          i--;
        }
      };
    this.selected_Assets.forEach(element => {
      let event = { which: 13 };
      let asset = {
        barCodeID: element,
      };
      this.GetAsset(event, asset, false);
      if (this.subAssetError != "") {

      }
    });
    this.modalService.dismissAll();
    this.selected_Assets = [];
  }
}
