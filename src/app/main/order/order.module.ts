import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { OrderDatatablesService } from 'app/main/order/list/datatables.service';

import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { OrderFilterComponent } from 'app/main/order/sidebar/filter/order-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    resolve: {
      datatables: OrderDatatablesService
    },
    data: { animation: 'order_list' }
  },
  {
    path: 'create',
    component: CreateComponent,
    data: { animation: 'CreateComponent' }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { animation: 'EditComponent' }
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    data: { animation: 'DetailComponent' }
  }
];

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    DetailComponent,
    OrderFilterComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule,
    CoreSidebarModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    NgMultiSelectDropDownModule
  ],
  providers: [OrderDatatablesService]
})

export class OrderModule { }
export enum orderStatus { Open = 1, Pending, Cancel, Completed }
export enum orderPage { All = 0, Open, Pending }
