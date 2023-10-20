import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreTranslationService } from '@core/services/translation.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Url } from 'app/colors.const';
import Swal from 'sweetalert2';
const moment = require('moment');
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  url = "";
  // public
  public sidebarToggleRef = false;
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  model: any = {};
  orderDetail: [];
  documentFile = [];
  customerDetail: any = {};
  subOrderDetail: any = [];
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
    const temp = this.tempData.filter(function (d) {
      return d.asset_name.toLowerCase().indexOf(val) !== -1 || !val;
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
  constructor(private modalService: NgbModal, private _coreSidebarService: CoreSidebarService, private _coreTranslationService: CoreTranslationService, private _orderService: OrderService, private route: ActivatedRoute, private _httpClient: HttpClient, private router: Router) {
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
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.route.paramMap
      .subscribe((params: any) => {
        this._orderService.GetByIdOrderItems(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
            if (data.result.orderdetails != null) {
              this.orderDetail = data.result.orderdetails;
            }
            if (data.result.orderFile != null) {
              data.result.orderFile.forEach(element => {
                this.documentFile.push(element);
              });
            }
            if (data.result.customers != null) {
              this.customerDetail = data.result.customers;
            }
          }
        })
      });
  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  modalOpenLG(modalLG, id) {
    this._httpClient.get(Url + 'api/Order/OrderAssetDetails/' + id).subscribe((response: any) => {
      if (response.status) {
        this.subOrderDetail = response.result;
      }
    });
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  modalOpenXs(modalxs, url) {
    this.url = url;
    this.modalService.open(modalxs, {
      centered: true,
      size: 'sm'
    });
  }

  CancelStatus(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B469D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'swal2-confirm ml-50',
        cancelButton: 'swal2-cancel ml-50'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this._httpClient.get(Url + "api/Order/UpdateOrderStatus/" + id).subscribe((data: any) => {
          if (data.status) {
            this.documentFile = [];
            this.getOrderDetail();
            this.simpleAlert();
          }
        });
      }
    })
  }

  simpleAlert() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">Cancelled Order</div>',
      showConfirmButton: false,
      timer: 30000,
      heightAuto: true
    })
  }
  fileDownload(obj) {
    this._orderService.DownloadFile(obj.id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    });
  }
}
