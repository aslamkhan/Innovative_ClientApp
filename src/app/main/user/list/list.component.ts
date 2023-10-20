import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDatatablesService } from 'app/main/user/list/datatables.service';
import { HttpClient } from '@angular/common/http';
import { ActiveClass, Available, NotActive, NotActiveClass, Url } from 'app/colors.const';
import { UserService } from '../user.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  role: string;
  // public
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  private loggedInUser: string;
  url = "";
  emailAddress: any;
  userADId: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;



  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempData.filter(function (d) {
      return (d.emailAddress != null && d.emailAddress.toLowerCase().indexOf(val) !== -1 || !val)
        || (d.userType != null && d.userType.toLowerCase().indexOf(val) !== -1 || !val)
        || (d.location != null && d.location.toLowerCase().indexOf(val) !== -1 || !val)
        || (d.department != null && d.department.toLowerCase().indexOf(val) !== -1 || !val)
        || (d.firstName != null && d.firstName.toLowerCase().indexOf(val) !== -1 || !val)
        || (d.lastName != null && d.lastName.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Constructor
   *
   * @param {OrderDatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(private _datatablesService: UserDatatablesService, private router: Router, private modalService: NgbModal, private userService: UserService, private _coreLoadingScreenService: CoreLoadingScreenService) {
    this._unsubscribeAll = new Subject();
    // this._coreTranslationService.translate(english, french, german, portuguese);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.getLoggedInUser();
    this.role = JSON.parse(localStorage.getItem('user_role'));
    localStorage.removeItem("item_type");
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
  }
  modalOpenXs(modalxs, url) {
    this.url = url;
    this.modalService.open(modalxs, {
      centered: true,
      size: 'md'
    });
  }

  exportCSVFile() {
    this.userService.GetExportCSVFileData().subscribe((data: any) => {
      if (data.status) {
        window.open(data.result, '_blank');
      }
    })
  }
  modalOpenSM(modalLG, user) {
    this.emailAddress = user.emailAddress;
    this.userADId = user.userId;
    this.modalService.open(modalLG, {
      centered: true,
      size: 'sm'
    });
  }
  Save(form: NgForm) {
    this._coreLoadingScreenService.showLoader("btnSave");
    var result = form.value;
    let objFormData = new FormData();
    objFormData.append('UserId', this.userADId);
    objFormData.append('Email', this.emailAddress);
    objFormData.append('OldPassword', result.OldPassword);
    objFormData.append('NewPassword', result.newPassword);
    objFormData.append('ConfirmPassword', result.confirmPassword);
    if (result.newPassword != result.confirmPassword) {
      this.simpleAlert("Your new password and confirmation password do not match", 'error');
      this._coreLoadingScreenService.hideLoader("btnSave");
      return;
    }
    this.userService.ResetAzureADUserPassword(objFormData).subscribe((data: any) => {
      if (data.status === false) {
        this.simpleAlert(data.message, 'error');
        this._coreLoadingScreenService.hideLoader("btnSave");
        return;
      }
      if (data.status === true) {
        this._coreLoadingScreenService.hideLoader("btnSave");
        this.simpleAlert("Password has been updated", 'success');
        this.modalService.dismissAll()
        this.router.navigateByUrl("/user/list");
      }
      this._coreLoadingScreenService.hideLoader("btnSave");
    })
  }
  simpleAlert(message: string, icon_: any) {
    Swal.fire({
      position: 'center',
      icon: icon_,
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">' + message + '</div>',
      showConfirmButton: false,
      timer: 3000,
      heightAuto: true,
    })
  }
  getLoggedInUser() {
    this.loggedInUser = JSON.parse(localStorage.getItem('emailId'))
  }

}

