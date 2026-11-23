import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { POPULAR_CATEGORIES } from '../../../core/constants/app.constants';
import { CategoryItem, GeoPoint } from '../../../core/models';
import { ComplaintService } from '../../../core/services/complaint.service';

type LocationStatus = 'idle' | 'loading' | 'error';

@Component({
  selector: 'app-raise-complaint',
  templateUrl: './raise-complaint.component.html',
  styleUrls: ['./raise-complaint.component.scss'],
})
export class RaiseComplaintComponent {
  readonly categories: CategoryItem[] = POPULAR_CATEGORIES;

  form = this.fb.nonNullable.group({
    category: ['', Validators.required],
    title: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(120)],
    ],
    description: ['', Validators.maxLength(1000)],
    location: [null as GeoPoint | null, Validators.required],
    media: [[] as File[]],
  });

  locationStatus: LocationStatus = 'idle';
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
  ) {}

  get selectedCategory(): string {
    return this.form.controls.category.value;
  }

  selectCategory(key: string): void {
    this.form.controls.category.setValue(key);
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locationStatus = 'error';
      return;
    }

    this.locationStatus = 'loading';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.form.controls.location.setValue({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        this.locationStatus = 'idle';
      },
      () => {
        this.form.controls.location.setValue(null);
        this.locationStatus = 'error';
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.loading = true;

    this.complaintService
      .createComplaint({
        category: raw.category,
        title: raw.title.trim(),
        description: raw.description.trim() || undefined,
        location: raw.location as GeoPoint, // guaranteed by the required validator
        media: raw.media,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'APP.RAISE_SUCCESS';
          this.form.reset();
          this.submitted = false;
          this.locationStatus = 'idle';
        },
        error: (err: Error) => {
          this.loading = false;
          this.errorMessage = err.message;
        },
      });
  }
}
