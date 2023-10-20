import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';

import { AssetDatatablesService } from 'app/main/asset/list/datatables.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from '../asset.service';
import { HttpClient } from '@angular/common/http';
import { Url } from 'app/colors.const';
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
  categoryList: any = [];
  // public
  public sidebarToggleRef = false;
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public totalElements;
  public pageNumber = 0;
  public pageSize = 10;
  public ColumnMode = ColumnMode;
  url = "";
  model: any = {};
  @ViewChild(DatatableComponent) table: DatatableComponent;


  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const filteredData = this.tempData.filter((d) => {
      const searchFields = [
        'assetName',
        'categoryName',
        'itemType',
        'id'
        // 'location'
      ];

      for (const field of searchFields) {
        if (d[field].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }

      return !val;
    });

    // update the rows
    this.kitchenSinkRows = filteredData;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Constructor
   *
   * @param {OrderDatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(private _datatablesService: AssetDatatablesService, private _router: Router, private modalService: NgbModal, private _coreSidebarService: CoreSidebarService, private _coreTranslationService: CoreTranslationService, private assetService: AssetService, private _httpClient: HttpClient) {
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
    localStorage.removeItem("item_serialNumber");
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.totalElements = this._datatablesService.paging.totalElements;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
    this.assetService.GetAssetItems().subscribe((data: any) => {
      if (data.status) {
        this.categoryList = data.result.assetCategoryList;
      }
    });
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this._datatablesService.model.pageNumber = pageInfo.offset + 1;
    this._datatablesService.model.pageSize = this.basicSelectedOption;
    this._datatablesService.getDataTableRowsfirst();
  }

  modalOpenXs(modalxs, url) {
    this.url = url;
    this.modalService.open(modalxs, {
      centered: true,
      size: 'md'
    });
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  onview(data) {
    this.onSetAssetValue(data)
    window.location.href = 'asset/view/' + data.id;
  }
  onedit(data) {
    this.onSetAssetValue(data);
    window.location.href = 'asset/edit/' + data.id;
  }
  oneditquantity(data) {
    this.onSetAssetValue(data);
    window.location.href = 'asset/editquantity/' + data.id;
  }
  onSetAssetValue(data) {
    if (data.itemType.includes('Asset')) {
      data.itemType = 'asset';
    } else if (data.itemType.includes('Inventory')) {
      data.itemType = 'inventory';
    }
    localStorage.setItem('assetitem_type', data.itemType);
    localStorage.setItem('asset_Id', data.id);
    localStorage.setItem('reservation_asset_Id', data.id);
    localStorage.setItem('asset_name', data.assetName);
    localStorage.setItem('item_image', data.itemImage);
  }
  exportCSVFile() {
    this.assetService.GetExportCSVFieData().subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }

  filterByCategory(categoryId: string) {
    let temp = this.tempData;
    if (categoryId != "" && categoryId != null) {
      temp = this.tempData.filter(function (d) {
        return d.categoryName.toString() === categoryId;
      });
    }
    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  searchSerialNumber(number) {
    var element = document.getElementById("txtsearchSerialNumber");
    element.classList.add("spinner-loading");
    const val = number.target.value.toLowerCase();
    if (val != null) {
      this.model.serialNumber = val;
      this.assetService.GetAllBySerialNumber(this.model).subscribe((response: any) => {
        this.kitchenSinkRows = response.status ? response.result.items : [];
        localStorage.setItem('item_serialNumber', val);
        localStorage.setItem('item_image', response.status ? "" : null);
        element.classList.remove("spinner-loading");
      });
    }
  }
}

