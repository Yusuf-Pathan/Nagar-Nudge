import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Category, PaginationMeta } from '../../../core/models';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = [];
  meta: PaginationMeta | undefined;
  loading = true;
  errorMessage = '';
  successMessage = '';

  editingId: string | null = null;
  saving = false;
  deletingId: string | null = null;

  form: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    code: [''],
    active: [true],
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get isEdit(): boolean {
    return this.editingId !== null;
  }

  fieldError(name: 'name' | 'code'): string | null {
    const control = this.form.get(name);
    if (!control || !control.touched || !control.errors) return null;
    if (control.errors['required']) return 'CATEGORIES.ERRORS.NAME_REQUIRED';
    if (control.errors['minlength']) return 'CATEGORIES.ERRORS.NAME_MIN';
    if (control.errors['maxlength']) return 'CATEGORIES.ERRORS.NAME_MAX';
    if (control.errors['pattern']) return 'CATEGORIES.ERRORS.CODE_PATTERN';
    return null;
  }

  startEdit(cat: Category): void {
    this.editingId = cat.id;
    this.successMessage = '';
    this.errorMessage = '';
    this.form.patchValue({
      name: cat.name,
      code: cat.code,
      active: cat.active,
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset({ name: '', code: '', active: true });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, code, active } = this.form.getRawValue();
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request$ = this.isEdit
      ? this.categoryService.update(this.editingId!, {
          name: name.trim(),
          code: code ? code.trim().toUpperCase() : undefined,
          active,
        })
      : this.categoryService.create({
          name: name.trim(),
          code: code ? code.trim().toUpperCase() : undefined,
          active,
        });

    request$.subscribe({
      next: (res) => {
        this.saving = false;
        this.successMessage = res.message || (this.isEdit ? 'Updated' : 'Created');
        this.cancelEdit();
        this.load();
      },
      error: (err: Error) => {
        this.saving = false;
        this.errorMessage = err.message;
      },
    });
  }

  remove(cat: Category): void {
    if (!confirm(`Delete category "${cat.name}"?`)) return;

    this.deletingId = cat.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoryService.remove(cat.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMessage = 'Category deleted';
        if (this.editingId === cat.id) this.cancelEdit();
        this.load();
      },
      error: (err: Error) => {
        this.deletingId = null;
        this.errorMessage = err.message;
      },
    });
  }

  toggleActive(cat: Category): void {
    this.categoryService.update(cat.id, { active: !cat.active }).subscribe({
      next: () => this.load(),
      error: (err: Error) => {
        this.errorMessage = err.message;
      },
    });
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.categoryService.list({ limit: 50 }).subscribe({
      next: ({ items, meta }) => {
        this.categories = items;
        this.meta = meta;
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.loading = false;
      },
    });
  }
}
