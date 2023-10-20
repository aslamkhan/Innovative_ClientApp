import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Url } from 'app/colors.const';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorService } from '../color.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-color-add',
  templateUrl: './color-add.component.html',
  styleUrls: ['./color-add.component.scss']
})

export class ColorAddComponent implements OnInit {
  message: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  clearValue: string = '';
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _colorService: ColorService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._colorService.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getColorName(color) {
    this.checkAssetId = "";
    if (color != null) {
      this._http.get(Url + 'api/References/ExistColorName/' + color).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "Color name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
          this.emailExists = false;
        }
      });
    }
  }

  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    this._colorService.AddColor(result).subscribe((res: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod('Color has been added',"/reference/color-list")
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    })
  }

  Cancel() {
    this.clearValue = null;
  }
}
