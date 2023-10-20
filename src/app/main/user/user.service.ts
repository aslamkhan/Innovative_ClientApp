import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Url } from "app/colors.const";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http: HttpClient) { }
  AddUser(model: any) {
    return this._http.post(Url + "api/User/register", model);
  }

  AddAzureADUser(model: any) {
    return this._http.post(Url + "api/User/CreateAzureAdUser", model);
  }
  UpdateUser(model: any) {
    return this._http.post(Url + "api/User/UpdateAzureADUser", model);
  }
  GetUser(Id: string) {
    return this._http.get(Url + "api/User/GetAzureADUserById?userId=" + Id);
  }
  DeleteUser(Id: string) {
    return this._http.delete(Url + "api/User/" + Id);
  }
  GetReferenceStatusList() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetExportCSVFileData() {
    return this._http.get(Url + "api/User/ExportToCsv");
  }
  ResetAzureADUserPassword(model: any) {
    return this._http.post(Url + "api/User/ResetPassword", model);
  }
}