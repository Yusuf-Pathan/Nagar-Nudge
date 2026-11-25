import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignComplaintsComponent } from './assign-complaints.component';

describe('AssignComplaintsComponent', () => {
  let component: AssignComplaintsComponent;
  let fixture: ComponentFixture<AssignComplaintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignComplaintsComponent]
    });
    fixture = TestBed.createComponent(AssignComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
