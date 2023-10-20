import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Url } from "app/colors.const";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  constructor(private _http: HttpClient) { }

  AddDepartment(model: any) {
    return this._http.post(Url + "api/References/Department/Insert", model);
  }
  UpdateDepartment(model: any) {
    return this._http.post(Url + "api/References/Department/Update", model);
  }
  GetDepartment(Id: string) {
    return this._http.get(Url + "api/References/Department/" + Id);
  }
  GetAllDepartments() {
    return this._http.get(Url + "api/References/Department/GetAll");
  }
  GetStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/References/Department/ExportToCsv");
  }
}
