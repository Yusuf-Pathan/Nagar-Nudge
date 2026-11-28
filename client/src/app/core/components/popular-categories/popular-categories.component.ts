import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CategoryItem } from '../../../core/models';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-popular-categories',
  templateUrl: './popular-categories.component.html',
  styleUrls: ['./popular-categories.component.scss']
})
export class PopularCategoriesComponent implements OnInit {
  categories$: Observable<CategoryItem[]> = of([]);

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getActiveTiles();
  }
}
