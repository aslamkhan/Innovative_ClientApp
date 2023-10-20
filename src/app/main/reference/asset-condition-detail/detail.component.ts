import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { ActiveClass, Available, NotActive, NotActiveClass } from 'app/colors.const';
import { AssetConditionService } from '../asset-condition/asset-condition.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  model:any={statusId: 0 };
  statuslist:any=[];

  
  constructor(private route: ActivatedRoute,private _http:HttpClient  ,private router: Router,private _assetConditionService:AssetConditionService) { }

  ngOnInit(): void {
    this.route.paramMap
    .subscribe((params:any) => {
      this._assetConditionService.GetCondition(params.params.id).subscribe((data:any)=>{
          this.model=data.result;
          ///// this.assetsN=data.result;
          // this.userL=data.result.users;
      })

    }
  );
  this._assetConditionService.GetStatusList().subscribe((data: any) => {
    this.statuslist = data.result.assetStatusList;
  })
  }

}
