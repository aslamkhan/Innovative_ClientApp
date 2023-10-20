import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { AssetService } from '../../asset.service';
import { AssetDatatablesService } from '../../list/datatables.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  dropDownForm: FormGroup;
  public orderFilterForm: FormGroup;
  public categoryName: [];
  public itemName: string = "";
  public itemType: [];
  public serialNumber: string = "";
  public location: [];
  model: any = {};
  modelForm: any = {};
  categoryList: [];
  locationList: [];
  constructor(private _coreSidebarService: CoreSidebarService, private route: ActivatedRoute, private setting: FormBuilder, private _datatablesService: AssetDatatablesService, private router: Router, private fb: FormBuilder, private _assetService: AssetService) {
    this.orderFilterForm = this.fb.group({
      categoryName: null,
      itemType: null,
      itemName: "",
      serialNumber: "",
      location: null
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
    this._datatablesService.categoryName = this.orderFilterForm.get('categoryName')?.value != null ? this.orderFilterForm.get('categoryName')?.value.map(function (e) { return e.text; }) : null;
    this._datatablesService.itemType = this.orderFilterForm.get('itemType')?.value != null ? this.orderFilterForm.get('itemType')?.value.map(function (e) { return e.value; }) : null;
    this._datatablesService.itemName = this.orderFilterForm.get('itemName')?.value != "" ? this.orderFilterForm.get('itemName')?.value : "";
    this._datatablesService.serialNumber = this.orderFilterForm.get('serialNumber')?.value != "" ? this.orderFilterForm.get('serialNumber')?.value : "";
    this._datatablesService.location = this.orderFilterForm.get('location')?.value != null ? this.orderFilterForm.get('location')?.value.map(function (e) { return e.text; }) : null;
    if (Array.isArray(this.orderFilterForm.get('itemType')?.value) && this.orderFilterForm.get('itemType')?.value.length === 0) {
      // code to execute when the value is an empty array
      this._datatablesService.itemType = null;
    }
    if (Array.isArray(this.orderFilterForm.get('categoryName')?.value) && this.orderFilterForm.get('categoryName')?.value.length === 0) {
      this._datatablesService.categoryName = null;
    }
    if (Array.isArray(this.orderFilterForm.get('location')?.value) && this.orderFilterForm.get('location')?.value.length === 0) {
      this._datatablesService.location = null;
    }
    this._datatablesService.getDataTableRowsfirst();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    //this.orderFilterForm.reset();
  }

  ngOnInit(): void {
    this._assetService.GetAssetItems().subscribe((data: any) => {
      if (data.status) {
        this.categoryList = data.result.assetCategoryList;
        this.locationList = data.result.assetLocationList;
      }
    });
    this.dropdownList = [
      { value: 1, text: 'Asset' },
      { value: 2, text: 'Inventory' }
    ];
    this.dropdownSettings = {
      idField: 'value',
      textField: 'text'
    };
    this.selectedItems = [
      // { item_id: 3, item_text: 'Item3' },
      // { item_id: 4, item_text: 'Item4' }
    ];
    this.dropDownForm = this.setting.group({
      myItems: [this.selectedItems],
      categoryItems: [this.categoryList],
      locationItems: [this.locationList]
    });

  }

}
