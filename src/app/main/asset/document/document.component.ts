import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, isNullOrUndefined, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';

// import { locale as german } from 'app/main/tables/datatables/i18n/de';
// import { locale as english } from 'app/main/tables/datatables/i18n/en';
// import { locale as french } from 'app/main/tables/datatables/i18n/fr';
// import { locale as portuguese } from 'app/main/tables/datatables/i18n/pt';

import { DocumentDatatablesService } from 'app/main/asset/document/datatables.service';
import { Url } from 'app/colors.const';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DocumentService } from './document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  role: string;
  assetId;
  assetName = "";
  assetImage = "";
  barcodeId = "";
  item_type = "";
  serialNumber = "";
  assetLocation = ""
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
      return d.id.toString().toLowerCase().indexOf(val) !== -1 || d.fileName.toLowerCase().indexOf(val) !== -1 || d.assetsCategory.categoryName.toLowerCase().indexOf(val) !== -1 ||
        d.fileType.toLowerCase().indexOf(val) !== -1 || d.lastUpdatedby.toLowerCase().indexOf(val) !== -1 ||
        (d.description != null && d.description.toLowerCase().indexOf(val) !== -1 || !val) || !val;
    });

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
  constructor(private _datatablesService: DocumentDatatablesService, private _coreTranslationService: CoreTranslationService, private _http: HttpClient, private router: Router, private _documentService: DocumentService) {
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
    let assetId = localStorage.getItem('item_assetId');
    this.assetId = assetId;
    this.assetName = localStorage.getItem('asset_barcodename');
    this.assetImage = localStorage.getItem('item_barcodeimage');
    this.barcodeId = localStorage.getItem('asset_barcodeId');
    this.item_type = localStorage.getItem('item_type');
    this.serialNumber = localStorage.getItem('asset_serialNumber');
    this.assetLocation = localStorage.getItem('asset_location');
    if (assetId) {
      this._http.get(Url + 'api/Asset/' + assetId).subscribe((data: any) => {
        // if (isNullOrUndefined(data.result)) {
        //   this.router.navigateByUrl("/asset/documents");
        // } else {
        if (data.status) {
          this.rows = data.result;
        }
        // }
      })
    } else {
      console.log("Please select a AssetId");
    }

    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
  }
  downloadDocument(id) {
    this._documentService.DownloadDocument(id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}

