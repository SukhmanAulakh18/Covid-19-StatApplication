import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsPage } from './details.page';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DetailsPage
      }
    ])
  ]
})
export class DetailsPageModule {}
