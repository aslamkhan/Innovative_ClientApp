import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';
@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private _http: HttpClient) { }

  AddColor(model: any) {
    return this._http.post(Url + "api/References/Color/Insert", model);
  }
  UpdateColor(model: any) {
    return this._http.post(Url + "api/References/Color/Update", model);
  }
  GetColor(Id: string) {
    return this._http.get(Url + "api/References/Color/" + Id);
  }
  GetStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/References/Color/ExportToCsv");
  }
}
