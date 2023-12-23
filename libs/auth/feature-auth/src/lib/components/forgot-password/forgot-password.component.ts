import { Component, ViewEncapsulation, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  FormValidatorError,
  SpinnerComponent,
  fadeInUp400ms,
} from '@common/ui-common';
import { AuthFireFacade } from '../../facades/auth-fire.facade';

@Component({
  selector: 'feature-auth-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
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
    MatIconModule,
    SpinnerComponent,
  ],
})
export class ForgotPasswordComponent {
  #_authFireFacade = inject(AuthFireFacade);

  readonly forgotPwdForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isSent = false;
  errorMessage: string = '';
  isSpin: boolean = false;

  async forgotPassword() {
    this.#disableFormSpin();
    try {
      await this.#_authFireFacade.forgotPassword(
        this.forgotPwdForm.value.email!,
      );
    } catch (error: any) {
      this.errorMessage = this.#splitMessage(error.message);

      this.#enableFormStopSpin();
    } finally {
      this.isSent = true;
      //
    }
  }

  getError(inputName: string) {
    return FormValidatorError.getFormControlErrorText(
      this.forgotPwdForm.get(inputName)!,
    );
  }

  #disableFormSpin() {
    this.errorMessage = '';
    this.forgotPwdForm.disable();
    this.isSpin = true;
  }

  #enableFormStopSpin() {
    this.isSpin = false;
    this.forgotPwdForm.enable();
    this.forgotPwdForm.updateValueAndValidity();
  }

  #splitMessage(msg: string): string {
    return msg.split('/').join(' ').split(':')[1];
  }
}
