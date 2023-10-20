import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { ActiveClass, Available, NotActive, NotActiveClass } from 'app/colors.const';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  model: any = {};
  role: string;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _customerService: CustomerService) { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap
      .subscribe((params: any) => {
        this._customerService.GetCustomer(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.model = data.result;
            switch (data.result.statusId) {
              case "1":
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
    this._customerService.DeleteCustomer(this.model.id).subscribe((data: any) => {
      this.router.navigateByUrl("/customer/list");
    })
  }
}
