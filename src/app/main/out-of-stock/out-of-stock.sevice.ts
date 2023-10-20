import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class OutOfStockService {

  constructor(private _http: HttpClient) { }

  GetStock(Id: string) {
    return this._http.get(Url + "api/OutOfStock/" + Id);
  }
  GetReferenceStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  AddStock(model: any) {
    return this._http.post(Url + "api/OutOfStock/Insert", model);
  }
  UpdateStock(model: any) {
    return this._http.post(Url + "api/OutOfStock/Update", model);
  }
  GetUsers() {
    return this._http.get(Url + "api/User/GetAzureADUsers");
  }
  GetSubCategory(id: any) {
    return this._http.get(Url + "api/Asset/GetSubCategoryByCategory?id=" + id);
  }
  GetAssetBySubLevel(id: any) {
    return this._http.get(Url + "api/OutOfStock/GetAssetBySubLevelID?subLevelID=" + id);
  }
}
