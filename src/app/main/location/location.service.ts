import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Url } from "app/colors.const";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(private _http: HttpClient) { }

  GetLocation(Id: string) {
    return this._http.get(Url + "api/Location/" + Id);
  }
  DeleteLocation(Id: string) {
    return this._http.delete(Url + "api/Location/" + Id);
  }
  GetReferenceStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  AddLocation(model: any) {
    return this._http.post(Url + "api/Location/Insert", model);
  }
  Updatelocation(model: any) {
    return this._http.post(Url + "api/Location/Update", model);
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/Location/ExportToCsv");
  }
}
