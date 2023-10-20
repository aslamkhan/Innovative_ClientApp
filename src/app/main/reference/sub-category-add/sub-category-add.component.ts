import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { SubCategoryServices } from '../sub-category/sub-category.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-sub-category-add',
  templateUrl: './sub-category-add.component.html',
  styleUrls: ['./sub-category-add.component.scss']
})
export class SubCategoryAddComponent implements OnInit {
  message: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  model: any = { statusId: 0, categoryID: 0 };
  categoryList: any = [];
  statuslist: any = [];
  clearValue: string = '';
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _subcategorySerivce: SubCategoryServices, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._subcategorySerivce.GetCategoryList().subscribe((data: any) => {
          this.categoryList = data.result.assetCategoryList;
          this.statuslist = data.result.assetStatusList;
        })
      });
  }

  getCategoryName(email) {
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistSubCategoryName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "SubCategory Name already exist!!";
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
    this._subcategorySerivce.AddSubCategory(result).subscribe((res: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod('Sub Category has been added',"/reference/sub_categories")
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    })
  }

  Cancel() {
    this.clearValue = null;
  }
}
