import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'ng2-flatpickr';

import { EventRef } from '../reservation.model';
import { ReservationService } from '../reservation.service';
@Component({
  selector: 'app-reservation-sidebar',
  templateUrl: './reservation-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReservationEventSidebarComponent implements OnInit {
  //  Decorator
  @ViewChild('startDatePicker') startDatePicker: Ng2FlatpickrComponent;
  @ViewChild('endDatePicker') endDatePicker: Ng2FlatpickrComponent;
  // @ViewChild(' #endDatePicker', { static: true }) endDatePickerNew: ElementRef;
  @ViewChildren(Ng2FlatpickrComponent)
  pickers: QueryList<Ng2FlatpickrComponent>;
  // Public
  public event: EventRef;
  public isDataEmpty;
  public dateValidation: any = [];
  customerList: any = [];
  assetId = "";
  assetName = "";
  barcodeId = "";
  item_type = "";
  eventData: any;
  startDate: Date = new Date;
  role: string;

  public startDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y H:i',
    mode: 'single',
    minDate: "today",
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true,
    onClose: function (selectedDates, dateStr, instance) {
      const errorMessageElement = document.getElementById("error-message");
      if (dateStr != null && dateStr != undefined && dateStr != '') {
        errorMessageElement.textContent = "";
      }
      else {
        errorMessageElement.textContent = "Start Date is required";
      }
    }
  };
  public endDateOptions = {
    altInput: true,
    mode: 'single',
    altFormat: 'd-m-Y H:i',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true,
    minDate: "today",
    onClose: function (selectedDates, dateStr, instance) {
      const errorMessageElement = document.getElementById("error-end-message");
      if (dateStr != null && dateStr != undefined && dateStr != '') {
        errorMessageElement.textContent = "";
      }
      else {
        errorMessageElement.textContent = "End Date is required";
      }
    }
  };
  invalid: boolean = false;
  endDateInvalid: boolean = false;
  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {ReservationService} _calendarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private _calendarService: ReservationService,
    private _http: HttpClient, private router: Router, private commonService: CommonService) {


  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Event Sidebar
   */
  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }
  AddEvent() {
    this.toggleEventSidebar();
    this._calendarService.createNewEvent();
    this._coreSidebarService.getSidebarRegistry('calendar-main-sidebar').toggleOpen();
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(objData) {
    this.toggleEventSidebar();
    if (objData) {
      var body = {
        barCodeID: this.barcodeId,
        assestsId: this.assetId,
        customerId: Number.parseInt(objData.customerId),
        startDate: new Date(objData.start[0] ? objData.start[0] : objData.start),
        endDate: new Date(objData.end[0] ? objData.end[0] : objData.end),
        description: objData.description
      }
      if (objData.description != null) {
        this._http.post(Url + 'api/AssetReservation/Insert', body).subscribe((data: any) => {
          if (data.status) {
            this._calendarService.getEvents();
          } else {
            this.commonService.simpleErrorAlertMethod(data.result);
          }
          objData.start = [];
          objData.end = [];
        });
      }
    }
  }

  /**
   * Update Event
   */
  updateEvent(event: EventRef) {
    this.toggleEventSidebar();
    var start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    var end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
    if (event) {
      var body = {
        id: event.id,
        barCodeID: this.barcodeId,
        assestsId: this.assetId,
        customerId: event.customerId,
        startDate: new Date(start),
        endDate: new Date(end),
        notes: event.description
      }
      this._http.post(Url + 'api/AssetReservation/Update', body).subscribe((data: any) => {
        if (data.status) {
          this._calendarService.getEvents();
        } else {
          this.commonService.simpleErrorAlertMethod(data.result);
        }
      });
    }
  }

  /**
   * Delete Event
   */
  deleteEvent(event) {
    // this._calendarService.deleteEvent(this.event);
    this._http.delete(Url + 'api/AssetReservation/' + event.id).subscribe(() => {
      this._calendarService.getEvents();
    });
    this.toggleEventSidebar();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    // Subscribe to current event changes
    this._calendarService.onCurrentEventChange.subscribe(response => {
      this.event = response;

      // If Event is available
      if (Object.keys(response).length > 0) {
        this.event = response;
        this.isDataEmpty = false;
        if (response.id === undefined) {
          this.isDataEmpty = true;
        }
      }
      // else Create New Event
      else {
        this.event = new EventRef();

        this.isDataEmpty = true;
      }
      this._http.get(Url + 'api/Asset/GetAssetItem').subscribe((data: any) => {
        if (data.result) {
          this.customerList = data.result.customerList;
        }
      })
      this.assetId = localStorage.getItem('reservation_asset_Id');
      this.assetName = localStorage.getItem('asset_barcodename');
      this.barcodeId = localStorage.getItem('asset_barcodeId');
      this.item_type = localStorage.getItem('item_type');
    });
  }
  endDateOnChangeEvent(event) {
    var start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    var aa = event.target.value;
    if (new Date(start) > new Date(aa)) {
      this.invalid = true;
      this.endDateInvalid = true;
    }
    else {
      this.invalid = false;
      this.endDateInvalid = false;
    }
  }
}
