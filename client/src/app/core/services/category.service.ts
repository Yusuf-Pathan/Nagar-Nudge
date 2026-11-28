import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { Category, CategoryItem } from '../models';
import { HttpService } from './http.service';

const CATEGORY_UI: Record<string, { icon: string; colorClass: string }> = {
  ROADS: { icon: 'bi-cone-striped', colorClass: 'cat-roads' },
  STREETLIGHTS: { icon: 'bi-lightbulb-fill', colorClass: 'cat-light' },
  GARBAGE: { icon: 'bi-trash3-fill', colorClass: 'cat-garbage' },
  WATER: { icon: 'bi-droplet-fill', colorClass: 'cat-water' },
  DRAINAGE: { icon: 'bi-water', colorClass: 'cat-drain' },
  OTHERS: { icon: 'bi-three-dots', colorClass: 'cat-others' },
};

const DEFAULT_UI = { icon: 'bi-pin-map-fill', colorClass: 'cat-others' };

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpService) {}

  getActive(): Observable<Category[]> {
    return this.http
      .get<Category[]>(ApiEndpoint.CATEGORIES, '', { active: 'true', limit: '50' })
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([] as Category[])),
      );
  }

  getActiveTiles(): Observable<CategoryItem[]> {
    return this.getActive().pipe(map((list) => list.map((c) => toCategoryItem(c))));
  }
}

export function toCategoryItem(category: Category): CategoryItem {
  const ui = CATEGORY_UI[category.code] ?? DEFAULT_UI;
  return {
    key: category.code,
    name: category.name,
    icon: ui.icon,
    colorClass: ui.colorClass,
  };
}
