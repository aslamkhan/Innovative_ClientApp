import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _http:HttpClient) { }

  AddCustomer(model:any){
    return this._http.post(Url+"api/Customer/Insert", model);
  }
  UpdateCustomer(model:any){
    return this._http.post(Url+"api/Customer/Update", model);
  }
  GetCustomer(id:string){
    return this._http.get(Url+"api/Customer/"+id);
  }
  GetLocation(){
    return this._http.get(Url+"api/Asset/GetAssetItem");
  }
  DeleteCustomer(Id:string){
    return this._http.delete(Url+"api/Customer/"+Id);
  }
  GetConfigurationApplication(Id: string) {
    return this._http.get(Url + "api/References/CofigurationApplication/" + 1);
  }
}