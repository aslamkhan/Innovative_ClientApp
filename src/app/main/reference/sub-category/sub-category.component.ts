import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';
import { SubCategoryDatatablesService } from './datatables.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ActiveClass, Available, NotActive, NotActiveClass, Url } from 'app/colors.const';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategoryServices } from './sub-category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubCategoryComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  TempModel: any = {};
  model: any = {};
  answer: any = [];
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
        'subCategoryName',
        'categoryName',
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
  constructor(private route: ActivatedRoute, private _http: HttpClient, private _datatablesService: SubCategoryDatatablesService, private modalService: NgbModal, private _coreTranslationService: CoreTranslationService, private router: Router, private _subcategorySerivce: SubCategoryServices) {
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
    this._http.get(Url + "api/References/SubCategory/" + Id).subscribe((data: any) => {
      this.model = data.result;
      this.answer = data.result.assetsCategory;
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
    this._subcategorySerivce.GetExportCSVFileData().subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}

