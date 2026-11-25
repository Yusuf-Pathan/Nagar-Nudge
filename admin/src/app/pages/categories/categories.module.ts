import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';

@NgModule({
  declarations: [ManageCategoriesComponent],
  imports: [CoreModule, FormsModule, ReactiveFormsModule, CategoriesRoutingModule],
})
export class CategoriesModule {}
