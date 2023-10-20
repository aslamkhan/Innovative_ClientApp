import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreMenuModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';

import { HorizontalMenuComponent } from 'app/layout/components/menu/horizontal-menu/horizontal-menu.component';

@NgModule({
  declarations: [HorizontalMenuComponent],
  imports: [CoreMenuModule, CoreCommonModule,RouterModule],
  exports: [HorizontalMenuComponent]
})
export class HorizontalMenuModule {}
