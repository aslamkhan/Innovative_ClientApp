import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { CustomerDatatablesService } from 'app/main/customer/list/datatables.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,   
    resolve: {
      datatables: CustomerDatatablesService
    },
    data: { animation: 'ListComponent' }
  },
  {
    path: 'create',
    component: AddComponent,   
    data: { animation: 'AddComponent' }
  },
  {
    path: 'edit/:id',
    component: EditComponent,   
    data: { animation: 'EditComponent' }
  },
  {
    path: 'detail/:id',
    component: ViewComponent,   
    data: { animation: 'ViewComponent' }
  }
];

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    CommonModule,
    NgMultiSelectDropDownModule,
    CsvModule
  ],
  providers: [CustomerDatatablesService]
})
export class CustomerModule { }
