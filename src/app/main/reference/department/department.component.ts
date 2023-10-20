import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';
import { DepartmentDatatablesService } from './datatables.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Url, Available, NotActive, NotActiveClass, ActiveClass } from 'app/colors.const';
import { DepartmentService } from './department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  TempModel: any = {};
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
    const filteredData = this.tempData.filter((d) => {
      const searchFields = [
        'name',
        'statusName'
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
  constructor(private _http: HttpClient, private _datatablesService: DepartmentDatatablesService, private modalService: NgbModal, private _coreTranslationService: CoreTranslationService, private _departmentService: DepartmentService) {
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
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
  }
  modalOpenLG(modalLG, Id) {
    this._departmentService.GetDepartment(Id).subscribe((data: any) => {
      if (data.status) {
        this.TempModel = data.result;
        switch (data.result.statusId) {
          case 1:
            this.TempModel.status = Available;
            this.TempModel.statusClass = ActiveClass;
            break;
          default:
            this.TempModel.status = NotActive;
            this.TempModel.statusClass = NotActiveClass;
            break;
        }
        this.modalService.open(modalLG, {
          centered: true,
          size: 'lg'
        });
      }
    })
  }
  exportCSVFile() {
    this._departmentService.GetExportCSVFileData().subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}

