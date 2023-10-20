import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { colors, Url, Available, NotActive, NotActiveClass, ActiveClass } from 'app/colors.const';
import { Router } from '@angular/router';
import { LocationService } from '../location.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  model: any = {};
  models: any = {};
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _locationService: LocationService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._locationService.GetLocation(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
            this.models = data.result.departments;
            switch (data.result.statusId) {
              case 1:
                this.model.status = Available;
                this.model.statusClass = ActiveClass;
                break;
              default:
                this.model.status = NotActive;
                this.model.statusClass = NotActiveClass;
                break;
            }
          }
        })

      }
      );
  }
  Delete() {
    this._locationService.DeleteLocation(this.model.id).subscribe((data: any) => {
      this.router.navigateByUrl("/location/list");
    })

  }


}
