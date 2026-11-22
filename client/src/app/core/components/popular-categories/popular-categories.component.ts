import { Component } from '@angular/core';
import { POPULAR_CATEGORIES } from '../../../core/constants/app.constants';
import { CategoryItem } from '../../../core/models';

@Component({
  selector: 'app-popular-categories',
  templateUrl: './popular-categories.component.html',
  styleUrls: ['./popular-categories.component.scss']
})
export class PopularCategoriesComponent {
  readonly categories: CategoryItem[] = POPULAR_CATEGORIES;
}
