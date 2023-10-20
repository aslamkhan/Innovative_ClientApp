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
import { DetailComponent } from './detail/detail.component';
import { LocationDatatablesService } from 'app/main/location/list/datatables.service';
import { CreateComponent } from './create/create.component';
import { LocationComponent } from '../shared/location/location.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
    {
        path: 'list',
        component: ListComponent,
        resolve: {
            datatables: LocationDatatablesService
        },
        data: { animation: 'ListComponent' }
    },
    {
        path: 'detail/:id',
        component: DetailComponent,
        data: { animation: 'DetailComponent' }
    },
    {
        path: 'create/:id',
        component: CreateComponent,
        data: { animation: 'CreateComponent' }
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
    } 
];

@NgModule({
    declarations: [ListComponent, DetailComponent, CreateComponent, LocationComponent, EditComponent],
    imports: [
        RouterModule.forChild(routes),
        NgbModule,
        TranslateModule,
        CoreCommonModule,
        ContentHeaderModule,
        CardSnippetModule,
        NgxDatatableModule,
        CsvModule,
    ],
    exports: [LocationComponent, CreateComponent],

    providers: [LocationDatatablesService]
})

export class LocationModule { } 