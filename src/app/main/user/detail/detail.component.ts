import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { colors, Url, Available, NotActive, NotActiveClass, ActiveClass } from 'app/colors.const';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  model: any = {};
  role: string;
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _userService: UserService) { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user_role'));
    this.route.paramMap
      .subscribe((params: any) => {
        this._userService.GetUser(params.params.id).subscribe((data: any) => {
          if (isNullOrUndefined(data.result)) {
            this.router.navigateByUrl("/user/list");
          } else {
            this.model = data.result;
          }
        })

      }
      );
  }

  Delete() {
    this._userService.DeleteUser(this.model.id).subscribe((data: any) => {
      this.router.navigateByUrl("/user/list");
    })

  }

}
