import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url, locationAddUrl, locationEditUrl } from 'app/colors.const';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  message: boolean = false;
  model: any = { statusId: 0 };
  statuslist: any = [];
  role:string;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router,private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.role=JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap
      .subscribe((params: any) => {
        this._http.get(Url + "api/Location/" + params.params.id).subscribe((data: any) => {
          this.model = data.result;
        })
      }
      );
    this._http.get(Url + "api/Asset/GetAssetItem").subscribe((data: any) => {
      this.statuslist = data.result.assetStatusList;
    });
  }
  simpleAlert() {
    Swal.fire("Location", 'you submitted successfully', 'success')
  }
  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    var locationUrl = "";
    if (result.id != null) {
      locationUrl = locationEditUrl;
    }
    else {
      locationUrl = locationAddUrl;
    }
    this._http.post(locationUrl, result).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.message = true;
      this.model = {};
    })
    this.router.navigateByUrl("/location/list");
  }
  Cancel() {
    //this.l.back();
  }
}

