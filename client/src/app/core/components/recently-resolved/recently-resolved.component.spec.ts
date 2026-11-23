import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyResolvedComponent } from './recently-resolved.component';

describe('RecentlyResolvedComponent', () => {
  let component: RecentlyResolvedComponent;
  let fixture: ComponentFixture<RecentlyResolvedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecentlyResolvedComponent]
    });
    fixture = TestBed.createComponent(RecentlyResolvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
