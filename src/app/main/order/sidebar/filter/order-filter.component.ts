import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderDatatablesService } from 'app/main/order/list/datatables.service';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import flatpickr from "flatpickr";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OrderService } from '../../order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class OrderFilterComponent implements OnInit {
  public orderFilterForm: FormGroup;
  public OrderId: number = 0;
  public StatusId: number = 0;
  public OrderTypeID: number = 0;
  public StartDate: string;
  public EndDate: string;
  public customerName: any;
  public collectedbyId: any;
  public rows: any;
  public kitchenSinkRows: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  conditiondropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;
  customerList = [];
  collectedByList = [];
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _datatablesService: OrderDatatablesService,
    private fb: FormBuilder,
    private datePipe: DatePipe, private setting: FormBuilder,
    private _orderService: OrderService
  ) {
    this.orderFilterForm = this.fb.group({
      OrderId: 0,
      StatusId: 0,
      OrderTypeID: 0,
      StartDate: null,
      EndDate: null,
      customerName: null,
      collectedbyId: null
    });
  }
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y'
  };
  /**
   * Toggle the sidebar
   *
   * @param name
   */

  toggleSidebar(name): void {
    this._datatablesService.model.customerName = this.orderFilterForm.get('customerName')?.value != null ? this.orderFilterForm.get('customerName')?.value.map(function (e) { return e.text; }) : null;
    this._datatablesService.model.collectedBy = this.orderFilterForm.get('collectedbyId')?.value != null ? this.orderFilterForm.get('collectedbyId')?.value.map(function (e) { return e.text; }) : null;


    this._datatablesService.model.OrderId = this.orderFilterForm.get('OrderId')?.value != '' ? this.orderFilterForm.get('OrderId')?.value : 0;
    this._datatablesService.model.StatusId = this.orderFilterForm.get('StatusId')?.value != null ? this.orderFilterForm.get('StatusId')?.value : 0;
    this._datatablesService.model.OrderTypeID = this.orderFilterForm.get('OrderTypeID')?.value != null ? this.orderFilterForm.get('OrderTypeID')?.value : 0;
    this._datatablesService.model.StartDate = this.orderFilterForm.get('StartDate')?.value != null && this.orderFilterForm.get('StartDate')?.value != '' ? this.orderFilterForm.get('StartDate')?.value : null;
    this._datatablesService.model.EndDate = this.orderFilterForm.get('EndDate')?.value != null && this.orderFilterForm.get('EndDate')?.value != '' ? this.orderFilterForm.get('EndDate')?.value : null;
    if (Array.isArray(this.orderFilterForm.get('customerName')?.value) && this.orderFilterForm.get('customerName')?.value.length === 0) {
      this._datatablesService.model.customerName = null;
    }
    if (Array.isArray(this.orderFilterForm.get('collectedbyId')?.value) && this.orderFilterForm.get('collectedbyId')?.value.length === 0) {
      this._datatablesService.model.collectedBy = null;
    }
    this._datatablesService.getDataTableRows();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    flatpickr("#endDate", {
      altInput: true,
      altFormat: "d-m-Y"
    });

    flatpickr("#startDate", {
      altInput: true,
      altFormat: "d-m-Y",
      onChange: function (dateStr, dateObj) {
        flatpickr("#endDate", {
          altInput: true,
          altFormat: "d-m-Y",
          minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd')
        });
      }
    });
    this._orderService.GetAssetItems().subscribe((data: any) => {
      this.customerList = data.result.customerList;
      this.collectedByList = data.result.customerList;
    });

    this.dropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.conditiondropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.selectedItems = [
    ];
    this.dropDownForm = this.setting.group({
      myItems: [this.selectedItems]
      // customerItems: [this.customerList],
      // collectedByItems: [this.collectedByList]
    });

  }
}
