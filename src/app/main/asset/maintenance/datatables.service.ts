import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { Url } from 'app/colors.const';

@Injectable()
export class MaintenanceDatatablesService implements Resolve<any> {
  rows: any;
  model: any = {};
  assetId = '';
  onDatatablessChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onDatatablessChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.model.assetId = localStorage.getItem('item_assetId');
      this.model.barcodeId = localStorage.getItem('asset_barcodeId');
      this.model.fromDate = this.model.fromDate != '' ? this.model.fromDate : null;
      this.model.toDate = this.model.toDate != '' ? this.model.toDate : null;
      this._httpClient.post(Url + 'api/Maintenance/GetAll', this.model).subscribe((response: any) => {
        if (response.status) {
          this.rows = response.result.items;
        }
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
