import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormValidatorError, fadeInUp400ms } from '@common/ui-common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'feature-auth-validation-email',
  standalone: true,
  templateUrl: './email-validation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ],
})
export class EmailValidationComponent {
  readonly validationForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  @Output()
  validation = new EventEmitter();

  @Input({ required: false })
  errorMessage = '';

  onValidation() {
    this.validation.emit(this.validationForm.value);
  }

  getError(inputName: string) {
    return FormValidatorError.getFormControlErrorText(
      this.validationForm.get(inputName)!,
    );
  }
}
