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
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { HistoryComponent } from './history/history.component';
import { UserDatatablesService } from 'app/main/user/list/datatables.service';
const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,   
    resolve: {
      datatables: UserDatatablesService
    },
    data: { animation: 'ListComponent' }
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
  },
  {
    path: 'history',
    component: HistoryComponent,   
    data: { animation: 'HistoryComponent' }
  } 
];

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    DetailComponent,
    HistoryComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule
  ],
  providers: [UserDatatablesService]
})
export class UserModule { }
