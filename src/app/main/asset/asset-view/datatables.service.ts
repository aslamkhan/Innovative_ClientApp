import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { Url } from 'app/colors.const';

@Injectable()
export class AssetDetailDatatablesService implements Resolve<any> {
  rows: any;
  onDatatablessChanged: BehaviorSubject<any>;

  public assetID: any;
  public From: any;
  public To: any;
  public checkOutFrom: any;
  public checkOutTo: any;
  public returnDueTo: any;
  public returnDueFrom: any;
  public status: [];
  public condition: [];
  public vendor: [];
  public assignedTo: [];
  public location: [];
  public serialNumber: any;
  model: any = {};
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private route: ActivatedRoute) {
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
      this.assetID = route.paramMap.get('id');
      Promise.all([this.getDataTableRows(this.assetID)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(id: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.route.paramMap
        .subscribe((params: any) => {
          this.model.assetID = id;
          this.model.checkOutFrom = this.checkOutFrom;
          this.model.checkOutTo = this.checkOutTo;
          this.model.status = this.status;
          this.model.condition = this.condition;
          this.model.returnDueFrom = this.returnDueFrom;
          this.model.returnDueTo = this.returnDueTo;
          this.model.vendor = this.vendor;
          this.model.location = this.location;
          if (localStorage.getItem("item_serialNumber") != "" && localStorage.getItem("item_serialNumber") != null) {
            this.model.serialNumber = localStorage.getItem("item_serialNumber");
          }
          else {
            this.model.serialNumber = this.serialNumber;
          }
          this._httpClient.post(Url + 'api/asset/AssetDetailAndCount', this.model).subscribe((response: any) => {
            if (response.status) {
              this.rows = response.result;
              localStorage.setItem('item_assetId', this.model.assetID);
            }
            else {
              this.rows = [];
            }
            this.onDatatablessChanged.next(this.rows);
            resolve(this.rows);
          }, reject);
        });
    })
  }
}
