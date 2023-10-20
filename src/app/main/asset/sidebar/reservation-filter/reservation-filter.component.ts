import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
@Component({
  selector: 'app-reservation-filter',
  templateUrl: './reservation-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReservationFilterComponent implements OnInit {
  constructor(private _coreSidebarService: CoreSidebarService) {}
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat:'d-m-Y'
  };
  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {}
}
