import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { HomeComponent } from 'app/main/home/home.component';
import { ChartsModule } from 'ng2-charts';
import { Role } from 'app/auth/models';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { DatePipe } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { animation: 'HomeComponent' }
  },
  {
    path: 'auth-redirect',
    component: HomeComponent
  },
];
// routing
@NgModule({
  declarations: [HomeComponent],
  imports: [
    ContentHeaderModule, RouterModule.forChild(routes),
    CoreCommonModule,
    ChartsModule
  ],
  providers: [DatePipe],
  exports: [HomeComponent]
})
export class HomeModule { }
