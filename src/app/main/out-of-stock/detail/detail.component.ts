import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { ActiveClass, Available, NotActive, NotActiveClass } from 'app/colors.const';
import { OutOfStockService } from '../out-of-stock.sevice';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  model: any = {};
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _outOfStockService: OutOfStockService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._outOfStockService.GetStock(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
          }
        })

      }
      );
  }

}
