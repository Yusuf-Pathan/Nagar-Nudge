import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EMAIL_REGEX, MOBILE_REGEX } from '../../../../core/validators/auth.validators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html'
})
export class SignupFormComponent {
  /** Emits the email after a successful sign-up so the login tab can prefill it. */
  @Output() registered = new EventEmitter<string>();
  @Output() switchToLogin = new EventEmitter<void>();

  form: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    mobile: ['', [Validators.required, Validators.pattern(MOBILE_REGEX)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  fieldError(name: 'name' | 'mobile' | 'email' | 'password'): string | null {
    const control = this.form.get(name);
    if (!control || !control.touched || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'AUTH.ERRORS.REQUIRED';
    }
    if (control.errors['minlength']) {
      return name === 'name' ? 'AUTH.ERRORS.NAME_MIN' : 'AUTH.ERRORS.PASSWORD_MIN';
    }
    if (control.errors['pattern']) {
      return name === 'mobile' ? 'AUTH.ERRORS.MOBILE' : 'AUTH.ERRORS.EMAIL';
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name.trim(),
      mobile: raw.mobile.trim(),
      email: raw.email.trim(),
      password: raw.password
    };

    this.loading = true;
    this.errorMessage = '';

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.registered.emit(payload.email);
      },
      error: (err: Error) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}
