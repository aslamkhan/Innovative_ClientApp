import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { StockDatatablesService } from '../../list/datatables.service';
import { OutOfStockService } from '../../out-of-stock.sevice';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-stock-logo-filter',
  templateUrl: './stock-logo-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StockLogoFilterComponent implements OnInit {
  assetsList = { AssetsId: 0 };
  userList = { userID: 0 };
  model: any = {};
  categoryList: any = { CategoryID: 0 };

  public outstockFilterForm: FormGroup;
  public assetName: "";
  public from: any = "";
  public to: any = "";
  constructor(private _coreSidebarService: CoreSidebarService, private router: Router, private route: ActivatedRoute, private _outOfStockService: OutOfStockService,
    private _datatablesService: StockDatatablesService,
    private fb: FormBuilder) {
    this.outstockFilterForm = this.fb.group({
      assetName: null,
      from: null,
      to: null
    });
  }
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'd-m-Y'
  };
  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._datatablesService.model.searchText = this.outstockFilterForm.get('assetName')?.value != null ? this.outstockFilterForm.get('assetName')?.value : "";
    this._datatablesService.model.from = this.outstockFilterForm.get('from')?.value != null ? this.outstockFilterForm.get('from')?.value : null;
    this._datatablesService.model.to = this.outstockFilterForm.get('to')?.value != null ? this.outstockFilterForm.get('to')?.value : null;
    this._datatablesService.getDataTableRows();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._outOfStockService.GetReferenceStatusList().subscribe((data: any) => {
          this.assetsList = data.result.assets;
        })
      });

    flatpickr("#to", {
      altInput: true,
      altFormat: "d-m-Y"
    });

    flatpickr("#from", {
      altInput: true,
      altFormat: "d-m-Y",
      onChange: function (dateStr, dateObj) {
        flatpickr("#to", {
          altInput: true,
          altFormat: "d-m-Y",
          minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd')
        });
      }
    });
  }

  cancelFilter(name): void {
    this.outstockFilterForm.reset();
  }
}
