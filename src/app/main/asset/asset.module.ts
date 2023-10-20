import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListComponent } from './list/list.component';
import { DocumentComponent } from './document/document.component';
import { ReservationComponent } from './reservation/reservation.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { HistoryComponent } from './history/history.component';
import { AssetDatatablesService } from 'app/main/asset/list/datatables.service';
import { DocumentDatatablesService } from 'app/main/asset/document/datatables.service';
import { HistoryDatatablesService } from 'app/main/asset/history/datatables.service';
import { MaintenanceDatatablesService } from 'app/main/asset/maintenance/datatables.service';
import { AssetDetailDatatablesService } from 'app/main/asset/asset-view/datatables.service';
import { ReservationHistoryDatatablesService } from 'app/main/asset/reservation-history/datatables.service';
import { StockHistoryDatatablesService } from 'app/main/asset/stock-history/datatables.service';
import { CoreSidebarModule } from '@core/components';
import { EditComponent } from './edit/edit.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { AssetViewComponent } from './asset-view/asset-view.component';
import { AssetCreateComponent } from './asset-create/asset-create.component';
import { AssetEditComponent } from './asset-edit/asset-edit.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { MaintenanceDetailComponent } from './maintenance-detail/maintenance-detail.component';
import { FilterComponent } from 'app/main/asset/sidebar/filter/filter.component';
import { ViewFilterComponent } from 'app/main/asset/sidebar/view-filter/view-filter.component';
import { ReservationFilterComponent } from 'app/main/asset/sidebar/reservation-filter/reservation-filter.component';
import { MaintenanceFilterComponent } from 'app/main/asset/sidebar/maintenance-filter/maintenance-filter.component';
import { ReservationHistoryComponent } from './reservation-history/reservation-history.component';
import { StockFilterComponent } from 'app/main/asset/sidebar/stock-filter/stock-filter.component';
import { CommentComponent } from './comment/comment.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { ReservationService } from './reservation/reservation.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ReservationEventSidebarComponent } from './reservation/reservation-sidebar/reservation-sidebar.component';
import { DocumentAddComponent } from './document-add/document-add.component';
import { DocumentService } from './document/document.service';
import { AddMaintenanceComponent } from './add-maintenance/add-maintenance.component';
import { VendorAddComponent } from '../reference/vendor-add/vendor-add.component';
import { ReferenceModule } from '../reference/reference.module';
import { ColorAddComponent } from '../reference/color/color-add/color-add.component';
import { CategoryAddComponent } from '../reference/category-add/category-add.component';
import { SubCategoryAddComponent } from '../reference/sub-category-add/sub-category-add.component';
import { AssetEditquantityComponent } from './asset-editquantity/asset-editquantity.component';
import { AssetBarcodeprintComponent } from './asset-barcodeprint/asset-barcodeprint.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SubassetEditComponent } from './subasset-edit/subasset-edit.component';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);
const routes: Routes = [
  {
    path: 'lists',
    component: ListComponent,
    resolve: {
      datatables: AssetDatatablesService
    },
    data: { animation: 'ListComponent' }
  },
  {
    path: 'edit/:id',
    component: AssetEditComponent,
    resolve: {
      datatables: AssetDatatablesService
    },
    data: { animation: 'AssetEditComponent' }
  },
  {
    path: 'editquantity/:id',
    component: AssetEditquantityComponent,
    resolve: {
      datatables: AssetDatatablesService
    },
    data: { animation: 'AssetEditquantityComponent' }
  },
  {
    path: 'subassetedit/:id',
    component: SubassetEditComponent,
    resolve: {
      datatables: AssetDatatablesService
    },
    data: { animation: 'SubassetEditComponent' }
  },
  {
    path: 'create',
    component: AssetCreateComponent,
    data: { animation: 'AssetCreateComponent' }
  },
  {
    path: 'view/:id',
    component: AssetViewComponent,
    resolve: {
      datatables: AssetDetailDatatablesService
    },
    data: { animation: 'AssetViewComponent' }
  },
  {
    path: 'detail/:id',
    component: AssetDetailComponent,
    data: { animation: 'AssetDetailComponent' }
  },
  {
    path: 'barcodeprint',
    component: AssetBarcodeprintComponent,
    data: { animation: 'AssetBarcodeprintComponent' }
  },
  {
    path: 'documents',
    component: DocumentComponent,
    resolve: {
      datatables: DocumentDatatablesService
    },
    data: { animation: 'DocumentComponent' }
  },
  {
    path: 'document/view/:id',
    component: DocumentViewComponent,
    data: { animation: 'DocumentViewComponent' }
  },
  {
    path: 'document/edit/:id',
    component: EditComponent,
    data: { animation: 'EditComponent' }
  },
  {
    path: 'document/add',
    component: DocumentAddComponent,
    data: { animation: 'DocumentAddComponent' }
  },
  {
    path: 'maintenances',
    component: MaintenanceComponent,
    resolve: {
      datatables: MaintenanceDatatablesService
    },
    data: { animation: 'MaintenanceComponent' }
  },
  // {
  //   path: 'maintenance/add',
  //   component: MaintenanceAddComponent,
  //   data: { animation: 'MaintenanceAddComponent' }
  // },
  {
    path: 'maintenance/detail/:id',
    component: MaintenanceDetailComponent,
    data: { animation: 'MaintenanceDetailComponent' }
  },
  {
    path: 'reservations',
    component: ReservationComponent,
    resolve: {
      data: ReservationService
    },
    data: { animation: 'ReservationComponent' }
  },
  {
    path: 'reservation-history',
    component: ReservationHistoryComponent,
    resolve: {
      datatables: ReservationHistoryDatatablesService
    },
    data: { animation: 'ReservationHistoryComponent' }
  },
  {
    path: 'stock-history',
    component: StockHistoryComponent,
    resolve: {
      datatables: StockHistoryDatatablesService
    },
    data: { animation: 'StockHistoryComponent' }
  },
  {
    path: 'comments',
    component: CommentComponent,
    data: { animation: 'CommentComponent' }
  },
  {
    path: 'histories',
    component: HistoryComponent,
    resolve: {
      datatables: HistoryDatatablesService
    },
    data: { animation: 'HistoryComponent' }
  },
  {
    path: 'history/detail/:id',
    component: HistoryDetailComponent,
    data: { animation: 'HistoryDetailComponent' }
  },
  {
    path: 'add-maintenance',
    component: AddMaintenanceComponent,
    data: { animation: 'AddMaintenanceComponent' }
  },
  {
    path: 'add-vendor',
    component: VendorAddComponent,
    data: { animation: 'VendorAddComponent' }
  },
  {
    path: 'add-color',
    component: ColorAddComponent,
    data: { animation: 'ColorAddComponent' }
  },
  {
    path: 'add-category',
    component: CategoryAddComponent,
    data: { animation: 'CategoryAddComponent' }
  },
  {
    path: 'app-sub-category-add',
    component: SubCategoryAddComponent,
    data: { animation: 'SubCategoryAddComponent' }
  }
];

@NgModule({
  declarations: [
    ListComponent,
    DocumentComponent,
    ReservationComponent,
    MaintenanceComponent,
    HistoryComponent,
    EditComponent,
    AssetViewComponent,
    AssetCreateComponent,
    AssetEditComponent,
    AssetDetailComponent,
    DocumentAddComponent,
    DocumentViewComponent,
    HistoryDetailComponent,
    MaintenanceDetailComponent,
    FilterComponent,
    ViewFilterComponent,
    ReservationFilterComponent,
    MaintenanceFilterComponent,
    ReservationHistoryComponent,
    CommentComponent,
    StockHistoryComponent,
    StockFilterComponent,
    ReservationEventSidebarComponent,
    AddMaintenanceComponent,
    AssetEditquantityComponent,
    AssetBarcodeprintComponent,
    SubassetEditComponent,

  ],
  imports: [
    CommonModule,
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
    FullCalendarModule,
    ReferenceModule,
    NgMultiSelectDropDownModule
  ],
  providers: [AssetDatatablesService, StockHistoryDatatablesService, ReservationService, ReservationHistoryDatatablesService, AssetDetailDatatablesService, DocumentDatatablesService, HistoryDatatablesService, MaintenanceDatatablesService, DatePipe]
})
export class AssetModule { }
