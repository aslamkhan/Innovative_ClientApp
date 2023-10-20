import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { Url } from 'app/colors.const';
import { CommonService } from 'app/common.service';
import { DocumentService } from '../document/document.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  message: boolean = false;
  assetId;
  assetName = "";
  assetImage = "";
  barcodeId = "";
  item_type = "";
  mode: any = {};
  model: any = { assetID: 0, CategoryID: 0, };
  assetsList = { assetID: 0 };
  userList = { userID: 0 };
  categoryList: any = { CategoryID: 0 };
  fileUploadError: string = "";
  isFileValid: boolean = true;
  application: any = { orderNumber: '', itemNumber: '', maxAttachmentsize: '', photosize: '', fileExtensions: '', barcodeSize: '', printPagesize: '', printPagesizeSmall: '', printPagesizeMedium: '', printPagesizeLarge: '' };
  serialNumber = "";
  assetLocation = "";
  constructor(private route: ActivatedRoute, private _http: HttpClient, private router: Router, private _documentService: DocumentService, private commonService: CommonService, private coreLoadingScreenService: CoreLoadingScreenService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: any) => {
        this._documentService.GetDocument(params.params.id).subscribe((data: any) => {
          this.mode = data.result;
          this.categoryList = data.result.assetsCategory;
        });
        this._documentService.GetAssetItems().subscribe((data: any) => {
          this.categoryList = data.result.assetCategoryList;
          this.assetsList = data.result.assets;
          this.userList = data.result.users;
        });
        this._documentService.GetConfigurationApplication(params.params.id).subscribe((data: any) => {
          if (data.status) {
            this.application = data.result;
          }
        });
      });
    let assetId = localStorage.getItem('item_assetId');
    this.assetId = assetId;
    this.assetName = localStorage.getItem('asset_barcodename');
    this.assetImage = localStorage.getItem('item_barcodeimage');
    this.barcodeId = localStorage.getItem('asset_barcodeId');
    this.item_type = localStorage.getItem('item_type');
    this.serialNumber = localStorage.getItem('asset_serialNumber');
    this.assetLocation = localStorage.getItem('asset_location');
    if (assetId) {
      this._http.get(Url + 'api/Asset/' + assetId).subscribe((data: any) => {
        if (data.status) {
          this.model = data.result;
        }
      })
    } else {
      console.log("Please select a AssetId");
    }
  }

  Save(form: NgForm) {
    this.coreLoadingScreenService.showLoader("btnSave");
    this.model.assetId = localStorage.getItem('item_assetId');
    const formData = new FormData();
    formData.append("AssestsID", this.model.assetId);
    formData.append("CategoryID", this.mode.categoryID);
    formData.append("Id", this.mode.id);
    formData.append("Description", this.mode.description != null ? this.mode.description : "");

    for (var i = 0; i < (<HTMLInputElement>document.getElementById('change-document')).files.length; i++) {
      let filetwo = (<HTMLInputElement>document.getElementById('change-document')).files[i];
      formData.append('FileType', filetwo, filetwo.name);
    }
    this._documentService.AddDocument(formData).subscribe(() => {
      this.coreLoadingScreenService.hideLoader("btnSave");
      this.commonService.simpleAlert("Document has been saved")
      this.router.navigateByUrl("/asset/documents");
    })
  }

  UploadDocument(e) {
    const file = e.target.files[0];
    if (file == null || file == undefined) {
      this.fileUploadError = `File is required`;
      this.isFileValid = false;
      return;
    }
    const extensions = this.application.fileExtensions != null && this.application.fileExtensions != "" ? this.application.fileExtensions.split(',') : [];
    let size = "";
    if (file.type.includes("image")) {
      size = this.application.photosize;
    } else {
      size = this.application.maxAttachmentsize;
    }
    if (size) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > parseInt(size)) {
        this.fileUploadError = `File size must be less than ${size} kb`;
        this.isFileValid = false;
        return;
      }
    }
    if (extensions.length > 0 && !extensions.some(x => file.name.toLowerCase().endsWith(x))) {
      this.fileUploadError = `File must be of type ${this.application.fileExtensions}`;
      this.isFileValid = false;
      return;
    }
    this.isFileValid = true;
    this.fileUploadError = "";
  }
}