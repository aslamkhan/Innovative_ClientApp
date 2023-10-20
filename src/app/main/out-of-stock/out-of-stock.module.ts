import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { StockDatatablesService } from 'app/main/out-of-stock/list/datatables.service';
import { StockLogoFilterComponent } from 'app/main/out-of-stock/sidebar/filter/stock-logo-filter.component';
import { CoreSidebarModule } from '@core/components';
import { CreateComponent } from '../out-of-stock/create/create.component';
import { FormsModule } from '@angular/forms';
import { EditComponent } from '../out-of-stock/edit/edit.component';

const routes: Routes = [
  {
    path: 'logs',
    component: ListComponent,
    resolve: {
      datatables: StockDatatablesService
    },
    data: { animation: 'ListComponent' }
  },
  {
    path: 'create',
    component: CreateComponent,
    data: { animation: 'CreateComponent' }
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    data: { animation: 'DetailComponent' }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { animation: 'EditComponent' }
  }
];

@NgModule({
  declarations: [ListComponent, DetailComponent, CreateComponent, StockLogoFilterComponent, EditComponent],
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
    FormsModule,
    Ng2FlatpickrModule
  ],
  providers: [StockDatatablesService]
})
export class OutOfStockModule { }
