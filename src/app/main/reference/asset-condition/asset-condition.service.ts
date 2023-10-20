import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class AssetConditionService {

  constructor(private _http: HttpClient) { }

  AddCondition(model: any) {
    return this._http.post(Url + "api/References/Condition/Insert", model);
  }
  UpdateCondition(model: any) {
    return this._http.post(Url + "api/References/Condition/Update", model);
  }
  GetCondition(Id: string) {
    return this._http.get(Url + "api/References/Condition/" + Id);
  }
  GetStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetAllCondition() {
    return this._http.get(Url + "api/References/Condition/GetAll");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/References/Condition/ExportToCsv");
  }
}