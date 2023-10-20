import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { SubCategoryServices } from '../sub-category/sub-category.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-sub-category-edit',
  templateUrl: './sub-category-edit.component.html',
  styleUrls: ['./sub-category-edit.component.scss']
})
export class SubCategoryEditComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0, categoryID: 0 };
  categoryList: any = [];
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  editSubCategory = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _subcategorySerivce: SubCategoryServices, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this._subcategorySerivce.GetCategoryList().subscribe((data: any) => {
      this.categoryList = data.result.assetCategoryList;
      this.statuslist = data.result.assetStatusList;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._subcategorySerivce.GetSubCategory(params.params.id).subscribe((data: any) => {
          this.model = data.result;
          this.editSubCategory = this.model.subCategoryName;
        })
      }
      );
  }

  getCategoryName(subCategory) {
    this.checkAssetId = "";
    if (subCategory != null && this.editSubCategory != subCategory) {
      this._http.get(Url + 'api/References/ExistSubCategoryName/' + subCategory).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "SubCategory Name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
          this.emailExists = false;
        }
      });
    } else {
      this.checkAssetId = " ";
      this.emailExists = false;
    }
  }

  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    this._subcategorySerivce.UpdateSubCategory(this.model).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlert("Sub category has been saved")
      this.router.navigateByUrl("/reference/sub_categories");
    })
  }
}