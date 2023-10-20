import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import Swal from 'sweetalert2';
import { CategoryService } from '../category/category.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _categorySerivce: CategoryService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  // constructor() { }

  ngOnInit(): void {
    this._categorySerivce.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
    this.route.paramMap
      .subscribe((params: any) => {
        this._categorySerivce.GetCategory(params.params.id).subscribe((data: any) => {
          this.model = data.result;
        })

      }
      );
  }

  getCategoryName(email) {
    // emails.email = "";
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistCategoryName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "Category Name already exist!!";
          this.emailExists = true;
        }
        else {
          this.checkAssetId = " ";
          this.emailExists = false;
        }
      });

    }
  }
  Save() {
    this.coreLoadingScreenService.showLoader("btnSave");
    this._categorySerivce.UpdateCategory(this.model).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlert("Category has been saved")
      this.router.navigateByUrl("/reference/categories");
    })
  }

}
