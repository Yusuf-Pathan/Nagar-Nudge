import { AbstractControl, ValidationErrors } from '@angular/forms';

export const MOBILE_REGEX = /^[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailOrMobileValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').toString().trim();
  if (!value) {
    return null;
  }
  return EMAIL_REGEX.test(value) || MOBILE_REGEX.test(value) ? null : { identifier: true };
}
