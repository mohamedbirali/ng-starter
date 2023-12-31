import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'ngs-landing-layout',
  templateUrl: './landing.layout.component.html',
  imports: [RouterOutlet, MatButtonModule, RouterLink, RouterLinkActive],
})
export class LandingLayoutComponent {}
