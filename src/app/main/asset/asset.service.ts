import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private _http: HttpClient) { }

  GetAssetItems() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetAllAssetItems() {
    return this._http.get(Url + "api/Asset/GetAll");
  }
  GetByIdAssetItems(Id: string) {
    return this._http.get(Url + "api/Asset/" + Id);
  }
  AddAuditAsset(model: any) {
    return this._http.post(Url + "api/Asset/AddAuditAsset", model);
  }
  GetAssetFilter(model: any) {
    return this._http.get(Url + "api/Asset/AssetFilter", model);
  }
  AddSubAsset(model: any) {
    return this._http.post(Url + "api/Asset/InsertSubAsset", model);
  }
  GetSubCategory(id: any) {
    return this._http.get(Url + "api/Asset/GetSubCategoryByCategory?id=" + id);
  }
  AddColor(model: any) {
    return this._http.post(Url + "api/References/Color/Insert", model);
  }
  AddVendor(model: any) {
    return this._http.post(Url + "api/References/Vendor/Insert", model);
  }
  AddSubCategory(model: any) {
    return this._http.post(Url + "api/References/SubCategory/Insert", model);
  }
  AddCategory(model: any) {
    return this._http.post(Url + "api/References/Category/Insert", model);
  }
  GetExportCSVFieData() {
    return this._http.get(Url + "api/Asset/ExportToCsv");
  }
  GetAssetBySubLevel(id: any) {
    return this._http.get(Url + "api/OutOfStock/GetAssetBySubLevelID?subLevelID=" + id);
  }
  GetExportCSVRentalFie(id: any) {
    return this._http.get(Url + "api/Order/ExportToCsvRentalHistory" + id);
  }
  DownloadDocument(id: any) {
    return this._http.get(Url + "api/Asset/DownloadAssetDocument?id=" + id);
  }
  GetConfigurationApplication(Id: string) {
    return this._http.get(Url + "api/References/CofigurationApplication/" + 1);
  }
  GetAllBySerialNumber(model: any) {
    return this._http.post(Url + "api/Asset/GetAllBySerialNumber", model);
  }
}