import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCategoriesComponent } from './popular-categories.component';

describe('PopularCategoriesComponent', () => {
  let component: PopularCategoriesComponent;
  let fixture: ComponentFixture<PopularCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopularCategoriesComponent]
    });
    fixture = TestBed.createComponent(PopularCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
