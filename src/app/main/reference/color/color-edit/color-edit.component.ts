
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { ColorService } from '../color.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-color-edit',
  templateUrl: './color-edit.component.html',
  styleUrls: ['./color-edit.component.scss']
})
export class ColorEditComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  colorName = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _colorService: ColorService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._colorService.GetColor(params.params.id).subscribe((data: any) => {
          this.model = data.result;
          this.model.colorName = data.result.color;
        })
      }
      );

    this._colorService.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getColorName(color) {
    this.checkAssetId = "";
    this.emailExists = false;
    if (color != null && color != ' ' && this.colorName == color) {
      this._http.get(Url + 'api/References/ExistColorName/' + color).subscribe((response: any) => {
        this.checkAssetId = response.result ? "Color name already exists!!" : " ";
        this.emailExists = response.result;
      });
    }
  }

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    this._colorService.UpdateColor(this.model).subscribe((res: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod('Color has been saved', "/reference/color-list")
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    })
  }
}


