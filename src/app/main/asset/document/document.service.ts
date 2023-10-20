import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from 'app/colors.const';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private _http: HttpClient) { }

  AddDocument(model: any) {
    return this._http.post(Url + "api/Asset/UploadDocument", model);
  }
  GetAssetItems() {
    return this._http.get(Url + "api/Asset/GetAssetItem");
  }
  GetAllAssetItems() {
    return this._http.get(Url + "api/Asset/GetAll");
  }
  GetDocument(id: string) {
    return this._http.get(Url + "api/Asset/GetDocumentId/" + id);
  }
  DownloadDocument(id: any) {
    return this._http.get(Url + "api/Asset/DownloadAssetDocument?id=" + id);
  }
  GetConfigurationApplication(Id: string) {
    return this._http.get(Url + "api/References/CofigurationApplication/" + 1);
  }
}