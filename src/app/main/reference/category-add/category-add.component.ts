import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonService } from 'app/common.service';
import { Url } from 'app/colors.const';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';


@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {
  message: boolean = false;
  registerForm: FormGroup;
  submitted = false;
  clearValue: string = '';
  statuslist: any = [];
  model: any = { statusId: 0 };
  checkAssetId = "";
  checkPhonenumber = "";
  emailExists: boolean = false;
  noExists: boolean = false;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _categorySerivce: CategoryService, private fb: FormBuilder, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }


  ngOnInit(): void {
    this._categorySerivce.GetStatusList().subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    })
  }

  getCategoryName(email) {
    this.checkAssetId = "";
    if (email != null) {
      this._http.get(Url + 'api/References/ExistCategoryName/' + email).subscribe((response: any) => {
        if (response.result) {
          this.checkAssetId = "Category name already exist!!";
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
    var data = form.value;
    this._categorySerivce.AddCategory(data).subscribe((res: any) => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      if (res.status) {
        this.commonService.simpleAlertMethod('Category has been added',"/reference/categories");
      } else {
        this.commonService.simpleErrorAlertMethod(res.result);
      }
    })
  }

  Cancel() {
    this.clearValue = null;
  }
}
