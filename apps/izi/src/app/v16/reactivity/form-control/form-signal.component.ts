import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'izi-form-signal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
    <p>form-signal works!</p>
    <form>
      <input
        [ngModel]="firstName()"
        name="first"
        (ngModelChange)="firstName.set($event)"
        placeholder="first name"
      />
      <input
        [ngModel]="lastName()"
        name="last"
        (ngModelChange)="lastName.set($event)"
        placeholder="last name"
      />
    </form>
    <div>full name: {{ name() }}</div>
  `,
})
export class FormSignalComponent {
  firstName = signal('');
  lastName = signal('');

  name = computed(() => `${this.firstName()} ${this.lastName()}`);
}
