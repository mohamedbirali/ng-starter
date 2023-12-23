import {
  FormValidatorError,
  SpinnerComponent,
  fadeInUp400ms,
} from '@common/ui-common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthFireFacade } from '../../facades/auth-fire.facade';
import { TUser } from '@auth/data-access-auth';

@Component({
  selector: 'feature-auth-register',
  standalone: true,
  templateUrl: `./register.component.html`,
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
export class RegisterComponent {
  #_authFireFacade = inject(AuthFireFacade);

  isSpin = false;
  readonly registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  errorMessage = '';

  async registerEmail() {
    if (this.registerForm.invalid) return;
    this.#disableFormSpin();
    try {
      await this.#_authFireFacade.registerEmail(
        this.registerForm.value as TUser,
      );
    } catch (error: any) {
      this.errorMessage = this.#splitMessage(error.message);

      this.#enableFormStopSpin();
    }
  }

  async registerGoogle(event: void) {
    this.#disableFormSpin();

    try {
      await this.#_authFireFacade.registerGoogle(event);
    } catch (error: any) {
      this.errorMessage = this.#splitMessage(error.message);

      this.#enableFormStopSpin();
    }
  }

  async registerGithub(event: void) {
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
      this.registerForm.get(inputName)!,
    );
  }

  #disableFormSpin() {
    this.errorMessage = '';
    this.registerForm.disable();
    this.isSpin = true;
  }

  #enableFormStopSpin() {
    this.isSpin = false;
    this.registerForm.enable();
    this.registerForm.updateValueAndValidity();
  }

  #splitMessage(msg: string): string {
    return msg.split('/').join(' ').split(':')[1];
  }
}
