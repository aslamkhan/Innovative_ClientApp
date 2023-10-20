import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CsvModule } from "@ctrl/ngx-csv";
import { TranslateModule } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { VendorComponent } from "./vendor/vendor.component";
import { CategoryComponent } from "./category/category.component";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { AssetConditionComponent } from "./asset-condition/asset-condition.component";
import { ColorListComponent } from './color/color-list/color-list.component';

import { ConfigurationComponent } from './configuration/configuration.component';
import { VendorDatatablesService } from "app/main/reference/vendor/datatables.service";
import { AssetConditionDatatablesService } from "app/main/reference/asset-condition/datatables.service";
import { CategoryDatatablesService } from "app/main/reference/category/datatables.service";
import { SubCategoryDatatablesService } from "app/main/reference/sub-category/datatables.service";
import { ColorDatatablesService } from "./color/color-list/datatables.service";

import { VendorAddComponent } from './vendor-add/vendor-add.component';
import { VendorEditComponent } from './vendor-edit/vendor-edit.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SubCategoryAddComponent } from './sub-category-add/sub-category-add.component';
import { SubCategoryEditComponent } from './sub-category-edit/sub-category-edit.component';
import { AssetConditionAddComponent } from './asset-condition-add/asset-condition-add.component';
import { AssetConditionEditComponent } from './asset-condition-edit/asset-condition-edit.component';

import { ColorAddComponent } from './color/color-add/color-add.component';
import { ColorEditComponent } from './color/color-edit/color-edit.component';

import { DepartmentComponent } from './department/department.component';
import { DepartmentAddComponent } from './department-add/department-add.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';
import { DepartmentDatatablesService } from "./department/datatables.service";
import { DetailComponent } from "./asset-condition-detail/detail.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: "vendors",
    component: VendorComponent,
    resolve: {
      datatables: VendorDatatablesService,
    },
    data: { animation: "VendorComponent" },
  },
  {
    path: "vendor/add",
    component: VendorAddComponent,
    data: { animation: "VendorAddComponent" },
  },
  {
    path: "vendor/edit/:id",
    component: VendorEditComponent,
    data: { animation: "VendorEditComponent" },
  },
  {
    path: "categories",
    component: CategoryComponent,
    resolve: {
      datatables: CategoryDatatablesService,
    },
    data: { animation: "CategoryComponent" },
  },
  {
    path: "category/add",
    component: CategoryAddComponent,
    data: { animation: "CategoryAddComponent" },
  },
  {
    path: "category/edit/:id",
    component: CategoryEditComponent,
    data: { animation: "CategoryEditComponent" },
  },
  {
    path: "sub_categories",
    component: SubCategoryComponent,
    resolve: {
      datatables: SubCategoryDatatablesService,
    },
    data: { animation: "SubCategoryComponent" },
  },
  {
    path: "sub_category/add",
    component: SubCategoryAddComponent,
    data: { animation: "SubCategoryAddComponent" },
  },
  {
    path: "sub_category/edit/:id",
    component: SubCategoryEditComponent,
    data: { animation: "SubCategoryEditComponent" },
  },
  {
    path: "asset_conditions",
    component: AssetConditionComponent,
    resolve: {
      datatables: AssetConditionDatatablesService,
    },
    data: { animation: "AssetConditionComponent" },
  },
  {
    path: "asset_condition/add",
    component: AssetConditionAddComponent,
    data: { animation: "AssetConditionAddComponent" },
  },
  {
    path: "asset_condition/edit/:id",
    component: AssetConditionEditComponent,
    data: { animation: "AssetConditionEditComponent" },
  },
  {
    path: "asset_condition/detail/:id",
    component: DetailComponent,
    data: { animation: "DetailComponent" },
  },
  {
    path: "configuration",
    component: ConfigurationComponent,
    data: { animation: "ConfigurationComponent" },
  }, {
    path: "departments",
    component: DepartmentComponent,
    resolve: {
      datatables: DepartmentDatatablesService,
    },
    data: { animation: "DepartmentComponent" },
  },
  {
    path: "department/add",
    component: DepartmentAddComponent,
    data: { animation: "DepartmentAddComponent" },
  },
  {
    path: "department/edit/:id",
    component: DepartmentEditComponent,
    data: { animation: "DepartmentEditComponent" },
  },
  {
    path: "color-list",
    component: ColorListComponent,
    resolve: {
      datatables: ColorDatatablesService,
    },
    data: { animation: "ColorListComponent" },
  },
  {
    path: "color-list/add",
    component: ColorAddComponent,
    data: { animation: "ColorAddComponent" },
  },
  {
    path: "color/edit/:id",
    component: ColorEditComponent,
    data: { animation: "ColorEditComponent" },
  },
];

@NgModule({
  declarations: [
    VendorComponent,
    CategoryComponent,
    SubCategoryComponent,
    AssetConditionComponent,
    ConfigurationComponent,
    VendorAddComponent,
    VendorEditComponent,
    CategoryEditComponent,
    CategoryAddComponent,
    SubCategoryAddComponent,
    SubCategoryEditComponent,
    AssetConditionAddComponent,
    AssetConditionEditComponent,

    ColorListComponent,
    ColorAddComponent,
    ColorEditComponent,
    DepartmentComponent,
    DepartmentAddComponent,
    DepartmentEditComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    Ng2FlatpickrModule,
    TranslateModule,
    CoreCommonModule,
    NgxDatatableModule,
    CsvModule,
    CoreSidebarModule,
    NgMultiSelectDropDownModule
  ],
    exports: [VendorAddComponent, ColorAddComponent, CategoryAddComponent, SubCategoryAddComponent],
  providers: [AssetConditionDatatablesService, SubCategoryDatatablesService, CategoryDatatablesService, VendorDatatablesService, DepartmentDatatablesService],
})
export class ReferenceModule { }
