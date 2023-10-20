import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryServices {

  constructor(private _http: HttpClient) { }

  AddSubCategory(model: any) {
    return this._http.post(Url + "api/References/SubCategory/Insert", model);
  }
  UpdateSubCategory(model: any) {
    return this._http.post(Url + "api/References/SubCategory/Update", model);
  }
  GetSubCategory(Id: string) {
    return this._http.get(Url + "api/References/SubCategory/" + Id);
  }
  GetCategoryList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/References/SubCategory/ExportToCsv");
  }
}