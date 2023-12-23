import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EmailValidationComponent } from './components/email-validation/email-validation.component';

export const FEATURE_AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    title: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    title: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'email-validation',
    title: 'email-validation',
    component: EmailValidationComponent,
  },
];
