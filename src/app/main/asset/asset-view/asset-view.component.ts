import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { CoreTranslationService } from '@core/services/translation.service';
import { AssetDetailDatatablesService } from 'app/main/asset/asset-view/datatables.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Url } from 'app/colors.const';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { style } from '@angular/animations';

@Component({
  selector: 'app-asset-view',
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetViewComponent implements OnInit {
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y'
  };
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  imagesrc;
  model: any = {};
  assetModel: any = {};
  printData: any = [];
  barcodeImage: any = [];
  selectedAssetId: any = [];
  // public
  public sidebarToggleRef = false;
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public statusCount: any;
  public inventoryQuantity: any;
  public assetId: any;
  public assetName: any;
  public assetImage: any;
  role: string;
  public item_type = 'asset';
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
      d.vendor = d.vendor !== null ? d.vendor : "";
      const searchFields = [
        'location',
        'assignTo',
        'condition',
        'vendor',
        'status',
        'assetID',
        'serialNumber'
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


  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
  }


  /**
   * Constructor
   *
   * @param {OrderDatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(private _datatablesService: AssetDetailDatatablesService, private _coreSidebarService: CoreSidebarService, private _coreTranslationService: CoreTranslationService, private route: ActivatedRoute, private _httpClient: HttpClient, private modalService: NgbModal, private router: Router) {
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap
      .subscribe((params: any) => {
        this.model.assetId = params.params.id;
        this._datatablesService.onDatatablessChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(response => {
            this.item_type = localStorage.getItem("assetitem_type");
            localStorage.setItem('filterasset_name', response.assetName);
            const lastItem = response.listAssetItemDetails[response.listAssetItemDetails.length - 1];
            if (this.item_type === 'asset' && !response.shareBarCode) {
              response.assetStatusCount.availableCount = lastItem.quantity;
            }
            this.statusCount = response.assetStatusCount;
            this.model.assetName = response.assetName;
            this.model.assetImage = response.assetImage;
            this.model.describe = response.assetDescription;
            if (response.listAssetItemDetails.length > 0) {
              this.rows = response.listAssetItemDetails;
              this.inventoryQuantity = lastItem.quantity;
            } else {
              this.rows = [];
            }
            this.tempData = this.rows;
            this.kitchenSinkRows = this.rows;
          });
      })
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  submitAssetResult(event) {
    this.model.assetID = this.model.assetId;
    this.model.from = event.startAssetIndex;
    this.model.to = event.endAssetIndex;

    if (this.model.from != "" && this.model.to != "") {
      this._httpClient.post(Url + 'api/asset/AssetDetailAndCount', this.model).subscribe((data: any) => {
        if (data.status) {
          this.kitchenSinkRows = data.result.listAssetItemDetails;
        }
        this.statusCount = data.result.assetStatusCount;
      });
    }
    else {
      this._datatablesService.getDataTableRows(this.model.assetID);
    }
  }
  openEditQuantity(model) {
    window.location.href = 'asset/editquantity/' + model.assetId;
  }
  openRentalHistory(id) {
    window.location.href = '/asset/reservation-history';
  }

  onprint = function () {
    js: window.print();
  }


  printImages(barcodeImage) {
    var printWindow = window.open('', '', 'top=0,left=0,height=100%,width=auto');
    // printWindow.document.open();

    // CSS styles for images and page breaks
    printWindow.document.write('<style>@media print { @page { size: 2in 1in; margin: 0; } body { margin: 0;} header { position: fixed; top: 0; left: 0; right: 0; height: 50px; background-color: lightgray; } footer { position: fixed; bottom: 0; left: 0; right: 0; height: 50px; background-color: lightgray; } .image-container { page-break-after: always; padding-top: 20px; padding-left: 5px;padding-right: 5px;} .image-container img { max-width: 100%; max-height: 100%; } }</style>');

    // Image HTML elements
    barcodeImage.forEach(element => {
      printWindow.document.write('<div class="image-container">');
      printWindow.document.write('<img src="' + element + '">');
      printWindow.document.write('</div>');
    });
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  printBarCode(data, modalLG) {
    var barAssetId = [];
    let event = null;
    if (data.startAssetIndex != null && data.endAssetIndex != null) {
      var getDecimalVal = data.endAssetIndex.toString().indexOf(".");
      event = data.endAssetIndex.toString().substring(getDecimalVal + 1);
    }
    document.getElementsByName('checkboxbar').forEach(function (e: any) {
      if (e.checked) {
        var barId = e.value;
        barAssetId.push(barId);
      }
    });

    if (barAssetId.length == 0) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        width: 400,
        title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">Please select atleast one checkbox</div>',
        showConfirmButton: false,
        timer: 5000,
        heightAuto: true,
      }).then(() => {
      });
      return;
    }
    this.selectedAssetId = barAssetId;
    this.modalOpenLG(modalLG);
    this._httpClient.post(Url + 'api/asset/PrintBarCode', this.selectedAssetId).subscribe((data: any) => {
      if (data.status) {
        this.barcodeImage = data.result;
      }
    })
  }

  modalOpenLG(modalLG) {
    this.modalService.open(modalLG, {
      centered: true,
      size: "lg",
    });
  }

  ondetail(data) {
    localStorage.setItem('item_type', localStorage.getItem('assetitem_type'));
    localStorage.setItem('item_assetId', this.model.assetId);
    localStorage.setItem('asset_barcodename', this.model.assetName);
    localStorage.setItem('item_barcodeimage', this.model.assetImage);
    localStorage.setItem('asset_barcodeId', data.assetID);

    localStorage.setItem('asset_location', data.location);
    localStorage.setItem('asset_serialNumber', data.serialNumber);
    window.location.href = 'asset/detail/' + data.assetID;
  }

  updateStatus(event: any) {
    const status = event.currentTarget.getAttribute("value");
    const barcodeId = event.currentTarget.id;
    let model = { StatusId: status, BarCodeId: barcodeId };

    this._httpClient.post(`${Url}api/asset/UpdateAssetStatus`, model).subscribe((data: any) => {
      if (data.status) {
        this.rows = this.rows.map((e) => {
          if (e.assetID === barcodeId) {
            e.status = status === '2' ? 'Not Active' : status === '3' ? 'Unavailable' : 'Available';
          }
          return e;
        });
        this.tempData = this.rows;
        this.kitchenSinkRows = this.rows;
      }
    });
  }
}