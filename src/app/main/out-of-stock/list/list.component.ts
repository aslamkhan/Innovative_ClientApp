import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { CoreTranslationService } from '@core/services/translation.service';
import { StockDatatablesService } from 'app/main/out-of-stock/list/datatables.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { HttpClient } from '@angular/common/http';
import { Url } from 'app/colors.const';
import { OutOfStockService } from '../out-of-stock.sevice';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  categoryList: any = [];
  role: string;
  // public
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;

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
      return d.assetName.toLowerCase().indexOf(val) !== -1 || !val || d.assetId == val || d.quanity == val || d.daysRequested == val || d.categoryName.toLowerCase().indexOf(val) !== -1;
    });

    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filterByCategory(categoryId: string) {
    var temp = this.tempData;
    if (categoryId != null && categoryId != "") {
      temp = this.tempData.filter(function (d) {
        return d.categoryId.toString() === categoryId;
      });
    }

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
  constructor(private _datatablesService: StockDatatablesService, private _coreSidebarService: CoreSidebarService, private _coreTranslationService: CoreTranslationService, private _httpClient: HttpClient, private _outOfStockService: OutOfStockService) {
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
      this.tempData = response;
      this.kitchenSinkRows = response;
    });
    this._outOfStockService.GetReferenceStatusList().subscribe((data: any) => {
      this.categoryList = data.result.assetCategoryList;
    })
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  exportCSVFile() {
    this._httpClient.get(Url + 'api/OutOfStock/ExportToCsv').subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}
