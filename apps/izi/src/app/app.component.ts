import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
  selector: 'izi-root',
  template: ` <router-outlet /> `,
})
export class AppComponent {}
