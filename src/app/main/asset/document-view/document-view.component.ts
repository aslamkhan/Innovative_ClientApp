import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { Url } from 'app/colors.const';
import { DocumentService } from '../document/document.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {
  assetId;
  assetName = "";
  assetImage = "";
  barcodeId = "";
  item_type = "";
  model: any = {};
  models: any = {};
  assetsList = { assetID: 0 };
  userList = { userID: 0 };
  categoryList: any = { CategoryID: 0 };
  serialNumber = "";
  assetLocation = "";
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _documentService: DocumentService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._documentService.GetDocument(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.models = data.result;
            this.categoryList = data.result.assetsCategory;
          }
        })

      });
    let assetId = localStorage.getItem('item_assetId');
    this.assetId = assetId;
    this.assetName = localStorage.getItem('asset_barcodename');
    this.assetImage = localStorage.getItem('item_barcodeimage');
    this.barcodeId = localStorage.getItem('asset_barcodeId');
    this.item_type = localStorage.getItem('item_type');
    this.serialNumber = localStorage.getItem('asset_serialNumber');
    this.assetLocation = localStorage.getItem('asset_location');
  }
  downloadDocument(id) {
    this._documentService.DownloadDocument(id).subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
}
