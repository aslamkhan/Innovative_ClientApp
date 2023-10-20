import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from "app/colors.const";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _http: HttpClient) { }

  GetAssetItems() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetAllOrderItems() {
    return this._http.get(Url + "api/Asset/GetAll");
  }
  GetByIdOrderItems(Id: string) {
    return this._http.get(Url + "api/Order/OredrHeader/" + Id);
  }
  GetConditionDetail() {
    return this._http.get("api/order-detail-datatable");
  }
  GetOrderStatus() {
    return this._http.get("api/order-datatable");
  }
  GetOrderTypeStatus() {
    return this._http.get("api/location-datatable");
  }
  AddCustomerList(model: any) {
    return this._http.post(Url + "api/Customer/Insert", model);
  }
  GetLocation() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  DownloadFile(Id: string) {
    return this._http.get(Url + "api/Order/DownloadDocument/" + Id);
  }
  GetConfigurationApplication() {
    return this._http.get(Url + "api/References/CofigurationApplication/" + 1);
  }
  SearchSubOrderDetail(model: any) {
    return this._http.post(Url + "api/Order/SearchSubOrderDetail", model);
  }
}
