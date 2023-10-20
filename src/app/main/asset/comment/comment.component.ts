import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { Url } from 'app/colors.const';
import { url } from 'inspector';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;
  model: any = {};
  rows: any;
  assetId;
  assetName = "";
  assetImage = "";
  barcodeId = "";
  item_type = "";
  role: string;
  serialNumber = "";
  assetLocation = ""
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    let assetId = localStorage.getItem('item_assetId');
    this.assetId = assetId;
    this.assetName = localStorage.getItem('asset_barcodename');
    this.assetImage = localStorage.getItem('item_barcodeimage');
    this.barcodeId = localStorage.getItem('asset_barcodeId');
    this.item_type = localStorage.getItem('item_type');
    this.serialNumber = localStorage.getItem('asset_serialNumber');
    this.assetLocation = localStorage.getItem('asset_location');
    if (assetId) {
      this._http.get(Url + 'api/AssetComment/' + localStorage.getItem('asset_barcodeId')).subscribe((data: any) => {
        if (data.status) {
          this.rows = data.result;
        }
      })
    } else {
      console.log("Please select a AssetId");
    }


    //  });
  }
  Save() {
    if (this.model.comments != undefined) {
      this.coreLoadingScreenService.showLoader("btnSaveComment");
      this.model.assetId = localStorage.getItem('item_assetId');
      this.model.barCodeID = localStorage.getItem('asset_barcodeId');
      this._http.post(Url + 'api/AssetComment/Insert', this.model).subscribe(() => {
        this.model = {};
        this._http.get(Url + 'api/AssetComment/' + localStorage.getItem('asset_barcodeId')).subscribe((data: any) => {
          if (data.status) {
            this.rows = data.result;
            this.coreLoadingScreenService.hideLoader("btnSaveComment");
          }
        })
      })
    }
  }

  getCommentDetails(assetId) {
    this._http.get(Url + 'api/AssetComment/' + assetId).subscribe((data: any) => {
      if (data.status) {
        this.rows = data.result;
      }
    })
  }

}
