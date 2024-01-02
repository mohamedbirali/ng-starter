import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'izi-root',
  template: `
    <div class="flex flex-row justify-center space-x-2 p-4 mb-4">
      @for(route of routes; track route) {
      <div [routerLink]="route" class="p-2 bg-teal-100">
        {{ route }}
      </div>
      }
    </div>
    <router-outlet />
  `,
})
export class AppComponent {
  routes = [
    'signal',
    'form-signal',
    'state-signal',
    'render',
    'ng-container', // ngIf, *ngFor
    'destroy',
    'destroy-parent',
    'input',
  ];
}
