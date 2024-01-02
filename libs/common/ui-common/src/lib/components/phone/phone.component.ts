import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { cloneDeep } from 'lodash';
import { COUNTRIES } from './data';
import { debounceTime, map } from 'rxjs';

export interface Country {
  id: string;
  iso: string;
  name: string;
  code: string;
  flagImagePos: string;
}

@Component({
  selector: 'ui-common-phone',
  standalone: true,
  templateUrl: './phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    NgClass,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    TextFieldModule,
    DatePipe,
  ],
})
export class PhoneComponent implements OnInit {
  @Input()
  phoneNumber: string = '';

  @Output()
  phoneNumberValue = new EventEmitter();

  _formBuilder = inject(FormBuilder);
  contactForm!: UntypedFormGroup;

  countries: Country[] = [];

  phoneNumbers?: any;

  ngOnInit(): void {
    this.contactForm = this._formBuilder.group({
      phoneNumbers: this._formBuilder.array([]),
    });
    this.phoneNumbers = (this.contactForm?.get('phoneNumbers') as any)[
      'controls'
    ];

    this.countries = cloneDeep(COUNTRIES);

    const selectedPhone = this.getIsoByCode(this.phoneNumber);

    const phoneNumbersFormGroups = [];

    phoneNumbersFormGroups.push(
      this._formBuilder.group({
        country: [selectedPhone?._country?.iso ?? 'ma'],
        phoneNumber: [selectedPhone?._phone],
        label: [''],
      }),
    );

    phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
      (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(
        phoneNumbersFormGroup,
      );
    });

    this.contactForm.valueChanges
      .pipe(
        debounceTime(300),
        map((value) => {
          this.phoneNumberValue.emit({
            ...value?.phoneNumbers[0],
            code: this.getCountryByIso(value?.phoneNumbers[0].country)?.code,
          });
        }),
      )
      .subscribe(); // todo: unsubscribe
  }

  getCountryByIso(iso: string): Country {
    return this.countries.find((country) => country.iso === iso)!;
  }

  getIsoByCode(phone?: string) {
    const [code, _phone] = phone ? phone.split('-') : '';
    return code
      ? {
          _country: this.countries.find((country) => country.code === code),
          _phone,
        }
      : undefined;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
