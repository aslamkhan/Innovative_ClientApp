import { Component, OnInit, OnDestroy, ViewChild, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil, filter } from 'rxjs/operators';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { CoreConfigService } from '@core/services/config.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { User } from 'app/auth/models';
import { CoreMenuItem } from '@core/types';
import { Role } from 'app/auth/models';
import { CommonService } from 'app/common.service';

@Component({
  selector: 'vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalMenuComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  isCollapsed: boolean;
  isScrolled: boolean = false;
  role: string;
  public currentUser: User;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreMenuService} _coreMenuService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {Router} _router
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _coreMenuService: CoreMenuService,
    private _coreSidebarService: CoreSidebarService,
    private _router: Router,
    private _commonService: CommonService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  @Input()
  item: CoreMenuItem;
  public isOpen = false;
  asset_toggle = false;
  user_toggle = false;
  reference_toggle = false;
  item_type;
  ngOnInit(): void {
    this.item_type = localStorage.getItem("item_type");
    this.role = JSON.parse(localStorage.getItem('user_role'));
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.isCollapsed = this._coreSidebarService.getSidebarRegistry('menu').collapsed;

    // Close the menu on router NavigationEnd (Required for small screen to close the menu on select)
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: any) => {
        if (event.url?.indexOf("asset") == -1 || event.url?.indexOf("asset/lists") != -1) {
          this.item_type = null;
          if (event.url?.indexOf("asset/lists") != -1)
            this.toggleOpen('asset_toggle');
        }
        if (this._coreSidebarService.getSidebarRegistry('menu')) {
          this._coreSidebarService.getSidebarRegistry('menu').close();
        }
      });

    // scroll to active on navigation end
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        setTimeout(() => {
          this.directiveRef.scrollToElement('.navigation .active', -180, 500);
        });
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

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Sidebar scroll set isScrolled as true
   */
  onSidebarScroll(): void {
    if (this.directiveRef.position(true).y > 3) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  /**
   * Toggle sidebar expanded status
   */
  toggleSidebar(): void {
    this._coreSidebarService.getSidebarRegistry('menu').toggleOpen();
  }

  /**
   * Toggle sidebar collapsed status
   */
  toggleSidebarCollapsible(): void {
    // Get the current menu state
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.isCollapsed = config.layout.menu.collapsed;
      });

    if (this.isCollapsed) {
      this._coreConfigService.setConfig({ layout: { menu: { collapsed: false } } }, { emitEvent: true });
    } else {
      this._coreConfigService.setConfig({ layout: { menu: { collapsed: true } } }, { emitEvent: true });
    }
  }
  logout() {
    localStorage.removeItem("is_mfa_required");
    localStorage.removeItem("item_type");
    localStorage.removeItem("asset_Id");
    localStorage.removeItem("asset_name");
    localStorage.removeItem("item_image");
    localStorage.removeItem("item_assetId");
    localStorage.removeItem("asset_barcodename");
    localStorage.removeItem("item_barcodeimage");
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("user_access_token_expire_time");
    localStorage.removeItem("user_role");
    localStorage.removeItem("office_location");
    localStorage.removeItem("asset_location");
    localStorage.removeItem("asset_serialNumber");
    localStorage.removeItem("filterasset_name");
    this._router.navigate(['/auth/login']);
  }
  toggleOpen(e): void {
    this.asset_toggle = false
    this.user_toggle = false
    this.reference_toggle = false
    if (e == "asset_toggle") {
      this.asset_toggle = !this.asset_toggle;
    } else if (e == "user_toggle") {
      this.user_toggle = !this.user_toggle;
    } else if (e == "reference_toggle") {
      this.reference_toggle = !this.reference_toggle;
    }
  }
  toggleclose() {
    this.asset_toggle = false
    this.user_toggle = false
    this.reference_toggle = false
  }
}
