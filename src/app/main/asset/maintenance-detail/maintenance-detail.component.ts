import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { Url } from 'app/colors.const';

@Component({
  selector: 'app-maintenance-detail',
  templateUrl: './maintenance-detail.component.html',
  styleUrls: ['./maintenance-detail.component.scss']
})
export class MaintenanceDetailComponent implements OnInit {
  model: any = {};
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        var id = params.params.id;
        this._http.get(Url + "api/Maintenance/" + (params.params.id)).subscribe((data: any) => {
          // if (isNullOrUndefined(data.result)) {
          //   this.router.navigateByUrl("/asset/maintenance");
          // } else {
          if (data.status) {
            this.model = data.result;
            this.model.assetId = localStorage.getItem('item_assetId');
            this.model.assetName = localStorage.getItem('asset_barcodename');
            this.model.assetImage = localStorage.getItem('item_barcodeimage');
            this.model.barCodeId = localStorage.getItem('asset_barcodeId');
          }
        })
      });
  }

}
