import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';

@NgModule({
  declarations: [LoginComponent, LoginFormComponent, SignupFormComponent],
  imports: [CoreModule, ReactiveFormsModule, AuthRoutingModule],
})
export class AuthModule {}
