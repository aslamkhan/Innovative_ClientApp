import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MaintenanceDatatablesService } from 'app/main/asset/maintenance/datatables.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaintenanceComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public sidebarToggleRef = false;
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public assetId = '';
  public barCodeId = '';
  public assetName = '';
  public assetImage = '';
  item_type = "";
  serialNumber = "";
  assetLocation = "";
  role: string;

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
        'assestsID',
        'maintenanceType',
        'priority',
        'status'
      ];

      for (const field of searchFields) {
        if (d[field].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return !val;
    });
    this.kitchenSinkRows = filteredData;
    this.table.offset = 0;
  }
  /**
   * Constructor
   *
   * @param {OrderDatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(private _datatablesService: MaintenanceDatatablesService, private _coreSidebarService: CoreSidebarService, private _coreTranslationService: CoreTranslationService, private route: ActivatedRoute, private _http: HttpClient, private commonService: CommonService) {
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
    this.assetId = localStorage.getItem('item_assetId');
    this.barCodeId = localStorage.getItem('asset_barcodeId');
    this.assetName = localStorage.getItem('asset_barcodename');
    this.assetImage = localStorage.getItem('item_barcodeimage');
    this.item_type = localStorage.getItem('item_type');
    this.serialNumber = localStorage.getItem('asset_serialNumber');
    this.assetLocation = localStorage.getItem('asset_location');
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  UpdateStatus(row) {
    if (row.statusId == '1') {
      return true;
    }
    this._http.get(Url + "api/Maintenance/UpdateStatus/" + row.id).subscribe((data: any) => {
      row.statusId = '1';
    })
  }

  filterByMaintenanceType(typeId: string) {
    let temp = this.tempData;
    if (typeId != '' && typeId != null) {
      temp = this.tempData.filter(function (d) {
        return d.maintenanceTYpeId.toString() === typeId;
      });
    }
    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  exportCSVFile() {
    var id = localStorage.getItem('asset_barcodeId');
    this._http.get(Url + 'api/Maintenance/ExportToCsv/' + id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
      else {
        this.commonService.simpleErrorAlertMethod(data.message);
      }
    })
  }

}