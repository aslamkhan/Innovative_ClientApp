import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { AssetService } from '../asset.service';

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})
export class AssetDetailComponent implements OnInit {
  modelForm: any = {};
  constructor(private router: Router, private route: ActivatedRoute, private _httpClient: HttpClient, private _assetService: AssetService) { }
  public item_type = "asset";
  public assetId: any;
  role: string;
  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap
      .subscribe((params: any) => {
        this._httpClient.get(Url + 'api/asset/GetAssetItemDetail/' + params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.modelForm = data.result;
            this.assetId = data.result.assetId;
            this.item_type = data.result.itemType;
            localStorage.setItem('asset_barcodename', data.result.assetName);
            localStorage.setItem('item_barcodeimage', data.result.assetImage);
            localStorage.setItem('assetitem_type', data.result.itemType);
            localStorage.setItem('asset_location', data.result.location);
            localStorage.setItem('asset_serialNumber', data.result.serialNumber);
          }
        })
      })
  }

  downloadDocument(id) {
    this._assetService.DownloadDocument(id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}
