import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { Url } from 'app/colors.const';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  model: any = {};
  assetId = "";
  assetName = "";
  assetImage = "";
  barcodeId = "";
  item_type = "";
  serialNumber = "";
  assetLocation = "";
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        var id = params.params.id;
        this._http.get(Url + "api/Asset/GetAuditDetail/" + (params.params.id)).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
          }
        })
      }
      );
    this.assetId = localStorage.getItem('item_assetId');
    this.assetName = localStorage.getItem('asset_barcodename');
    this.assetImage = localStorage.getItem('item_barcodeimage');
    this.barcodeId = localStorage.getItem('asset_barcodeId');
    this.item_type = localStorage.getItem('item_type');
    this.serialNumber = localStorage.getItem('asset_serialNumber');
    this.assetLocation = localStorage.getItem('asset_location');
  }

}
