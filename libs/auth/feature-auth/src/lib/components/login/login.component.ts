import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  FormValidatorError,
  SpinnerComponent,
  fadeInUp400ms,
} from '@common/ui-common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthFireFacade } from '../../facades/auth-fire.facade';
import { TUser } from '@auth/data-access-auth';

@Component({
  selector: 'feature-auth-login',
  standalone: true,
  templateUrl: `./login.component.html`,
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInUp400ms],
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    SpinnerComponent,
  ],
})
export class LoginComponent {
  //
  #_authFireFacade = inject(AuthFireFacade);
  //
  isSpin = false;
  errorMessage = '';

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async loginEmail() {
    if (this.loginForm.invalid) return;
    this.#disableFormSpin();
    try {
      await this.#_authFireFacade.loginEmail(this.loginForm.value as TUser);
    } catch (error: any) {
      this.errorMessage = this.#splitMessage(error.message);

      this.#enableFormStopSpin();
    }
  }

  async loginGoogle(event: void) {
    this.#disableFormSpin();

    try {
      await this.#_authFireFacade.registerGoogle(event);
    } catch (error: any) {
      this.errorMessage = this.#splitMessage(error.message);

      this.#enableFormStopSpin();
    }
  }

  async loginGithub(event: void) {
    this.#disableFormSpin();
    try {
      await this.#_authFireFacade.registerGithub(event);
    } catch (error: any) {
      this.errorMessage = this.#splitMessage(error.message);

      this.#enableFormStopSpin();
    }
  }

  getError(inputName: string) {
    return FormValidatorError.getFormControlErrorText(
      this.loginForm.get(inputName)!,
    );
  }

  #disableFormSpin() {
    this.errorMessage = '';
    this.loginForm.disable();
    this.isSpin = true;
  }

  #enableFormStopSpin() {
    this.isSpin = false;
    this.loginForm.enable();
    this.loginForm.updateValueAndValidity();
  }

  #splitMessage(msg: string): string {
    return msg.split('/').join(' ').split(':')[1];
  }
}
