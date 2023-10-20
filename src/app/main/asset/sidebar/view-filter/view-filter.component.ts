import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { OrderService } from 'app/main/order/order.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { AssetDetailDatatablesService } from '../../asset-view/datatables.service';
import { AssetService } from '../../asset.service';
@Component({
  selector: 'app-view-filter',
  templateUrl: './view-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ViewFilterComponent implements OnInit {
  conditionsList: any = [];
  orderTypeList: any = [];
  vendorList: any = [];
  locationList: any = [];
  public orderFilterForm: FormGroup;
  public assetID: any;
  public checkOutFrom: any;
  public checkOutTo: any;
  public status: [];
  public condition = [];
  public returnDueFrom: any;
  public returnDueTo: any;
  public vendor: string = "";
  public location = [];
  public assignedTo = [];
  public assetName: any;
  public serialNumber: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  conditiondropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;
  constructor(private _coreSidebarService: CoreSidebarService, private _orderService: OrderService, private _assetService: AssetService, private _datatablesService: AssetDetailDatatablesService, private setting: FormBuilder, private route: ActivatedRoute) {
    this.orderFilterForm = this.setting.group({
      assetID: null,
      checkOutFrom: null,
      checkOutTo: null,
      status: null,
      condition: null,
      returnDueFrom: null,
      returnDueTo: null,
      vendor: null,
      location: null,
      serialNumber: null
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
   2*/
  toggleSidebar(name): void {
    this._datatablesService.assetID = this.assetID;
    this._datatablesService.serialNumber = this.orderFilterForm.get('serialNumber')?.value != null ? this.orderFilterForm.get('serialNumber')?.value : null;
    this._datatablesService.checkOutFrom = this.orderFilterForm.get('checkOutFrom')?.value != null ? this.orderFilterForm.get('checkOutFrom')?.value[0] : null;
    this._datatablesService.checkOutTo = this.orderFilterForm.get('checkOutTo')?.value != null ? this.orderFilterForm.get('checkOutTo')?.value[0] : null;
    this._datatablesService.condition = (this.orderFilterForm.get('condition')?.value != null && this.orderFilterForm.get('condition')?.value.length > 0) ? this.orderFilterForm.get('condition')?.value.map(function (e) { return e.text; }) : null;
    this._datatablesService.status = (this.orderFilterForm.get('status')?.value != null && this.orderFilterForm.get('status')?.value.length > 0) ? this.orderFilterForm.get('status')?.value.map(function (e) { return e.text; }) : null;
    this._datatablesService.returnDueFrom = this.orderFilterForm.get('returnDueFrom')?.value != null ? this.orderFilterForm.get('returnDueFrom')?.value[0] : null;
    this._datatablesService.returnDueTo = this.orderFilterForm.get('returnDueTo')?.value != null ? this.orderFilterForm.get('returnDueTo')?.value[0] : null;
    this._datatablesService.location = (this.orderFilterForm.get('location')?.value != null && this.orderFilterForm.get('location')?.value.length > 0) ? this.orderFilterForm.get('location')?.value.map(function (e) { return e.text; }) : null;
    this._datatablesService.vendor = (this.orderFilterForm.get('vendor')?.value != null && this.orderFilterForm.get('vendor')?.value.length > 0) ? this.orderFilterForm.get('vendor')?.value.map(function (e) { return e.text; }) : null;
    this._datatablesService.getDataTableRows(this._datatablesService.assetID);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this.assetID = params.params.id;
      });
    this._orderService.GetOrderTypeStatus().subscribe((response: any) => {
      if (response.length > 0) {
        this.orderTypeList = response;
      }
    });
    this.assetName = localStorage.getItem('filterasset_name');
    this._assetService.GetAssetItems().subscribe((data: any) => {
      this.vendorList = data.result.assetVendorList;
      this.locationList = data.result.assetLocationList;
      this.conditionsList = data.result.assetConditionList;
    });
    this.dropdownList = [
      { value: 1, text: 'Available' },
      { value: 2, text: 'Not Active' },
      { value: 3, text: 'Check Out' },
      { value: 4, text: 'Maintenance' },
      { value: 5, text: 'Inspection' },
      { value: 6, text: 'Unavailable' }
    ];
    this.dropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.conditiondropdownSettings = {
      idField: 'value',
      textField: 'text',
    };
    this.selectedItems = [
      // { item_id: 3, item_text: 'Item3' },
      // { item_id: 4, item_text: 'Item4' }
    ];
    this.dropDownForm = this.setting.group({
      myItems: [this.selectedItems],
      locationItems: [this.locationList]
    });

  }
}
