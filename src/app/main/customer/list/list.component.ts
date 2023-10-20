import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDatatablesService } from 'app/main/customer/list/datatables.service';
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
  // TempModel:any={};
  // model: any = {};
  // answer : any = [];


  role: string;
  // public
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  url = "";
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
        'email',
        'firstName',
        'lastName',
        'departmentName',
        'id'
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
  constructor(private _datatablesService: CustomerDatatablesService, private modalService: NgbModal, private _coreTranslationService: CoreTranslationService, private http: HttpClient) {
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
    localStorage.removeItem("item_type");
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
  }

  exportCSVFile() {
    this.http.get(Url + 'api/Customer/ExportToCsv').subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}