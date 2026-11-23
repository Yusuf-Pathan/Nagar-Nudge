import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { emailOrMobileValidator } from '../../../../core/validators/auth.validators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit {
  /** Filled after a successful sign-up so the user does not retype it. */
  @Input() prefillIdentifier = '';
  @Output() switchToSignup = new EventEmitter<void>();

  form: FormGroup = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, emailOrMobileValidator]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.prefillIdentifier) {
      this.form.patchValue({ identifier: this.prefillIdentifier });
    }
  }

  fieldError(name: 'identifier' | 'password'): string | null {
    const control = this.form.get(name);
    if (!control || !control.touched || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'AUTH.ERRORS.REQUIRED';
    }
    if (control.errors['identifier']) {
      return 'AUTH.ERRORS.IDENTIFIER';
    }
    if (control.errors['minlength']) {
      return 'AUTH.ERRORS.PASSWORD_MIN';
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

    const { identifier, password } = this.form.getRawValue();
    this.loading = true;
    this.errorMessage = '';

    this.auth.login({ identifier: identifier.trim(), password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (err: Error) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}
