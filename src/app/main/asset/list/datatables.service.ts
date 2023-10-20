import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { AssetService } from '../asset.service';
import { Url } from 'app/colors.const';

@Injectable()
export class AssetDatatablesService implements Resolve<any> {
  rows: any;
  onDatatablessChanged: BehaviorSubject<any>;
  public itemType: [];
  public itemName: string = "";
  public categoryName: [];
  public serialNumber: string = "";
  public location: [];
  model: any = {};
  paging: any = {};
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _assetService: AssetService) {
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
      Promise.all([this.getDataTableRowsfirst()]).then(() => {
        resolve();
      }, reject);
    });
  }
  getDataTableRowsfirst(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.model.itemTypes = this.itemType;
      this.model.itemName = this.itemName;
      this.model.assetCategories = this.categoryName;
      this.model.serialNumber = this.serialNumber;
      this.model.assetLocation = this.location;
      this._httpClient.post(Url + 'api/Asset/GetAll', this.model).subscribe((response: any) => {
        if (response.status) {
          this.rows = response.result.items;
          this.paging = response.result;
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
