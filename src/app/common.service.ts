import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private location: Location, private router: Router) { }
  Cancel() {
    this.location.back();
  }
  simpleAlert(message) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">' + message + '</div>',
      showConfirmButton: false,
      timer: 1000,
      heightAuto: true,
    })
  }

  simpleAlertMethod(message: string, url: string = "") {
    Swal.fire({
      position: 'center',
      icon: 'success',
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">' + message + '</div>',
      showConfirmButton: false,
      timer: 1000,
      heightAuto: true,
    }).then(() => {
      if (url != "")
        this.router.navigateByUrl(url);
    });
  }

  simpleErrorAlertMethod(message: string, url: string = "") {
    Swal.fire({
      position: 'center',
      icon: 'error',
      width: 400,
      title: '<div style="direction:rtl;font-size:24px;font-weight:bold;">' + message + '</div>',
      showConfirmButton: false,
      timer: 5000,
      heightAuto: true,
    }).then(() => {
      if (url != "")
        this.router.navigateByUrl(url);
    });
  }

  keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z_ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  validNumbers(event) {
    if (event.which != 46 && (event.which < 47 || event.which > 59)) {
      event.preventDefault();
      if ((event.which == 46)) {
        event.preventDefault();
      }
    }
  }
  removeAssetStorage() {
    localStorage.removeItem("item_type");
    localStorage.removeItem("asset_Id");
    localStorage.removeItem("asset_name");
    localStorage.removeItem("item_image");
  }
}
