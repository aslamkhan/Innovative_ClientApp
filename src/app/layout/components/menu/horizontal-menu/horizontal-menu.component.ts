import { Component, HostListener, HostBinding, ElementRef, ViewEncapsulation, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HorizontalMenuComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  item_type = "";
  asset_toggle = false;
  user_toggle = false;
  reference_toggle = false;
  currentRoute = "";
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreMenuService} _coreMenuService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {Router} router
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _coreMenuService: CoreMenuService,
    private _coreSidebarService: CoreSidebarService,
    private router: Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void {
    this.item_type = localStorage.getItem("item_type");
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    // Get current menu
    this._coreMenuService.onMenuChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.menu = this._coreMenuService.getCurrentMenu();
      });
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  onmouseEnter(e) {
    if (e == "asset_toggle") {
      this.asset_toggle = !this.asset_toggle;
    } else if (e == "user_toggle") {
      this.user_toggle = !this.user_toggle;
    } else if (e == "reference_toggle") {
      this.reference_toggle = !this.reference_toggle;
    }
  }
  onmouseLeave(e) {
    if (e == "asset_toggle") {
      this.asset_toggle = !this.asset_toggle;
    } else if (e == "user_toggle") {
      this.user_toggle = !this.user_toggle;
    } else if (e == "reference_toggle") {
      this.reference_toggle = !this.reference_toggle;
    }
  }
}
