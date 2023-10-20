import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaintenanceDatatablesService } from '../../maintenance/datatables.service';
import { DatePipe } from '@angular/common';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-maintenance-filter',
  templateUrl: './maintenance-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MaintenanceFilterComponent implements OnInit {
  public maintenanceFilterForm: FormGroup;
  private datePipe: DatePipe;
  constructor(private fb: FormBuilder, private _coreSidebarService: CoreSidebarService, private _datatablesService: MaintenanceDatatablesService) {
    this.maintenanceFilterForm = this.fb.group({
      maintenanceType: null,
      startDate: null,
      endDate: null,
      status: null
    });
  }
  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._datatablesService.model.maintenanceType = this.maintenanceFilterForm.get('maintenanceType').value != null && this.maintenanceFilterForm.get('maintenanceType').value != '' ? parseInt(this.maintenanceFilterForm.get('maintenanceType').value) : null;
    this._datatablesService.model.status = this.maintenanceFilterForm.get('status').value != null ? parseInt(this.maintenanceFilterForm.get('status').value) : null;
    if (this.maintenanceFilterForm.get('startDate').value != null)
      this._datatablesService.model.fromDate = this.maintenanceFilterForm.get('startDate').value;
    if (this.maintenanceFilterForm.get('endDate').value != null)
      this._datatablesService.model.toDate = this.maintenanceFilterForm.get('endDate').value;
    this._datatablesService.getDataTableRows();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    flatpickr("#endDate", {
      altInput: true,
      altFormat: "d-m-Y"
    });

    flatpickr("#startDate", {
      altInput: true,
      altFormat: "d-m-Y",
      onChange: function (dateStr, dateObj) {
        flatpickr("#endDate", {
          altInput: true,
          altFormat: "d-m-Y",
          minDate: new DatePipe('en-US').transform(dateStr[0], 'yyyy-MM-dd')
        });
      }
    });
  }
}
