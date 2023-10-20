import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private _http: HttpClient) { }

  AddVendor(model: any) {
    return this._http.post(Url + "api/References/Vendor/Insert", model);
  }
  UpdateVendor(model: any) {
    return this._http.post(Url + "api/References/Vendor/Update", model);
  }
  GetVendor(Id: string) {
    return this._http.get(Url + "api/References/Vendor/" + Id);
  }
  GetStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/References/Vendor/ExportToCsv");
  }
}
