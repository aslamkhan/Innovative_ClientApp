import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private _http: HttpClient) { }

  AddConfigurationAbout(model: any) {
    return this._http.post(Url + "api/References/InsertConfigurationAbout", model);
  }
  UpdateConfigurationAbout(model: any) {
    return this._http.post(Url + "api/References/UpdateConfigurationAbout", model);
  }
  GetConfigurationAbout(Id: string) {
    return this._http.get(Url + "api/References/Configuration/" + 1);
  }

  AddConfigurationManagement(model: any) {
    return this._http.post(Url + "api/References/ConfigurationManagement/Insert", model);
  }
  UpdateConfigurationManagement(model: any) {
    return this._http.post(Url + "api/References/CofigurationManagement/Update", model);
  }
  GetConfigurationManagement(Id: string) {
    return this._http.get(Url + "api/References/CofigurationManagement/" + 1);
  }

  AddConfigurationApplication(model: any) {
    return this._http.post(Url + "api/References/ConfigurationApplication/Insert", model);
  }
  UpdateConfigurationApplication(model: any) {
    return this._http.post(Url + "api/References/CofigurationApplication/Update", model);
  }
  GetConfigurationApplication(Id: string) {
    return this._http.get(Url + "api/References/CofigurationApplication/" + 1);
  }
  

  AddConfiguration(model: any) {
    return this._http.post(Url + "api/References/CofigurationLast/Insert", model);
  }
  UpdateConfiguration(model: any) {
    return this._http.post(Url + "api/References/CofigurationLast/Update", model);
  }
  GetConfiguration(Id: string) {
    return this._http.get(Url + "api/References/CofigurationLast/" + 1);
  }
}