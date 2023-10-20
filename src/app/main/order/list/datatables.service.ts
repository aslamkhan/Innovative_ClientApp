import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { Url } from 'app/colors.const';
import { Location } from '@angular/common';
import { orderStatus } from '../order.module';

@Injectable()
export class OrderDatatablesService implements Resolve<any> {
  rows: any;
  model: any = { OrderId: 0, StatusId: 0, OrderTypeID: 0, StartDate: null, EndDate: null, customerName: null, collectedBy: null };
  onDatatablessChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private location: Location) {
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
      this.model.StatusId = orderStatus.Pending;
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    localStorage.removeItem("item_type");
    return new Promise((resolve, reject) => {
      this._httpClient.post(Url + 'api/Order/GetAllHeader', this.model).subscribe((response: any) => {
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
