import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';



import { ReservationHistoryDatatablesService } from 'app/main/asset/reservation-history/datatables.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from '../asset.service';
import { Url } from 'app/colors.const';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'app/common.service';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationHistoryComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public sidebarToggleRef = false;
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  url = "";
  assetId = "";
  assetName = "";
  assetImage = "";
  barcodeId = "";
  item_type = "";
  serialNumber = "";
  assetLocation = "";

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
        'assignedTo',
        'orderId',
        'checkOutCondition',
        'checkInCondition',
        'checkOut'
      ];
      for (const field of searchFields) {
        if (d[field] != null && d[field].toString().toLowerCase().indexOf(val) !== -1) {
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
  constructor(private _datatablesService: ReservationHistoryDatatablesService, private modalService: NgbModal, private _coreSidebarService: CoreSidebarService, private _coreTranslationService: CoreTranslationService, private assetService: AssetService, private _httpClient: HttpClient, private commonService: CommonService) {
    this._unsubscribeAll = new Subject();
    // this._coreTranslationService.translate(english, french, german, portuguese);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
      this.assetId = localStorage.getItem('item_assetId');
      this.assetName = localStorage.getItem('asset_barcodename');
      this.assetImage = localStorage.getItem('item_barcodeimage');
      this.barcodeId = localStorage.getItem('asset_barcodeId');
      this.item_type = localStorage.getItem('item_type');
      this.serialNumber = localStorage.getItem('asset_serialNumber');
      this.assetLocation = localStorage.getItem('asset_location')
    });
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  modalOpenXs(modalxs, url) {
    this.url = url;
    this.modalService.open(modalxs, {
      centered: true,
      size: 'md'
    });
  }
  exportCSVFile() {
    var id = localStorage.getItem('asset_barcodeId');
    this._httpClient.get(Url + 'api/Order/ExportToCsvRentalHistory/' + id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
      else {
        this.commonService.simpleErrorAlertMethod(data.message);
      }
    })
  }
}



