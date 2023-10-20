import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Url } from "app/colors.const";


@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private _http: HttpClient) { }
    getUserAssetCount(location: string) {
        return this._http.get(Url + "api/Dashboard/UserAssetCount?location=" + location);
    }

    getAssetGraphDetail(location: string) {
        return this._http.get(Url + "api/Dashboard/AssetGraphDetail?location=" + location);
    }

    OldestFiveAssetDetails(location: string) {
        return this._http.get(Url + "api/Dashboard/OldestFiveAssetDetails?location=" + location);
    }

    TopFiveAssetDetails(location: string) {
        return this._http.get(Url + "api/Dashboard/TopFiveAssetDetails?location=" + location);
    }
}