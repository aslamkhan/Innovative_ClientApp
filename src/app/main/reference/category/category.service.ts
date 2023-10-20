import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http: HttpClient) { }

  AddCategory(model: any) {
    return this._http.post(Url + "api/References/Category/Insert", model);
  }
  UpdateCategory(model: any) {
    return this._http.post(Url + "api/References/Category/Update", model);
  }
  GetCategory(Id: string) {
    return this._http.get(Url + "api/References/Category/" + Id);
  }
  GetStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/References/Category/ExportToCsv");
  }
}