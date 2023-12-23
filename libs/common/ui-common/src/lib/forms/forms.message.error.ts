import { AbstractControl } from '@angular/forms';

export class FormValidatorError {
  static getFormControlErrorText(ctrl: AbstractControl): string {
    if (ctrl.hasError('required')) {
      return 'Input is required';
    } else if (ctrl.hasError('pattern')) {
      return 'Not authorized';
    } else if (ctrl.hasError('minlength')) {
      return 'Input is short';
    } else if (ctrl.hasError('maxlength')) {
      return 'Input is long';
    } else if (ctrl.hasError('mustMatch')) {
      return "Passwords doesn't match";
    } else if (ctrl.hasError('email')) {
      return "Doesn't seems like an email !";
    } else {
      return 'Input contains an error';
    }
  }
}
