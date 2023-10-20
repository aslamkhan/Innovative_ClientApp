import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ReportComponent } from './report.component';

const routes: Routes = [  
  {
    path: '',
    component: ReportComponent,   
    data: { animation: 'ReportComponent' }
  } 
];

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule
  ]
})
export class ReportModule { }
