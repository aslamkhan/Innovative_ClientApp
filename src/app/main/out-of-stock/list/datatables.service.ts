import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { Url } from 'app/colors.const';

@Injectable()
export class StockDatatablesService implements Resolve<any> {
  model: any = {};
  rows: any = {};
  pageSize: number = 100;
  public assetName: any = "";
  public from: any = "";
  public to: any = "";
  // assetL:any={};
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
      this.model.from = this.model.from != '' ? this.model.from : null;
      this.model.to = this.model.to != '' ? this.model.to : null;
      this._httpClient.post(Url + 'api/OutOfStock/GetAll', this.model).subscribe((response: any) => {
        if (response.status) {
          this.rows = response.result.items;
        }
        else {
          this.rows = [];
        }
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
