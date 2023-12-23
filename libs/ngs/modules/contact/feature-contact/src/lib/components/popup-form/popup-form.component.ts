import { HelperDateService } from '@feature-common';
import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PhoneComponent } from '@common/ui-common';
import { FireAuthService, FireStoreService } from '@firebase';
import { map } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'feature-contact-popup-form',
  standalone: true,
  templateUrl: './popup-form.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    TitleCasePipe,
    PhoneComponent,
  ],
})
export class ContactPopupFormComponent implements OnInit {
  // injections
  #_fireStoreService = inject(FireStoreService);
  #_fireAuthService = inject(FireAuthService);
  dialogRef = inject(MatDialogRef<ContactPopupFormComponent>);
  data: any = inject(MAT_DIALOG_DATA);

  // form
  contactForm = inject(FormBuilder).group({
    name: ['', Validators.required],
    color: [''],
    phone: ['', [Validators.required]],
    toggle: [''],
  });

  // helpers
  #helperDateService = new HelperDateService();
  user: User | null = null;

  ngOnInit(): void {
    if (this.data.type) this.contactForm.patchValue(this.data.type);
    this.#_fireAuthService
      .user$()
      .pipe(
        map((user) => {
          this.user = user;
        }),
      )
      .subscribe();
  }

  edit() {
    if (this.contactForm.invalid) return;

    if (`${this.data.actionName}`.toLowerCase() === 'create')
      this.#_fireStoreService.addDoc('contacts', {
        userId: this.user?.uid,
        ...this.contactForm.value,
        contact: this.contactForm.value.phone,
        avatar: 'logo/logo-dark.png',
        updatedAt: this.#helperDateService.format(new Date()),
      });

    if (`${this.data.actionName}`.toLowerCase() === 'edit')
      this.#_fireStoreService.updateDoc(
        'contacts',
        {
          ...this.contactForm.value,
          contact: this.contactForm.value.phone,
          updatedAt: this.#helperDateService.format(new Date()),
        },
        this.data.type.id!,
      );
  }

  patchPhoneNumber($event: any) {
    this.contactForm
      .get('phone')
      ?.setValue(`${$event.code}-${$event.phoneNumber}`);
  }
}
