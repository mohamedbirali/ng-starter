import { MatIconModule } from '@angular/material/icon';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'ui-common-basic-layout',
  templateUrl: './basic.layout.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    NavigationComponent,
    RouterOutlet,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
  ],
  styles: [
    `
      ui-common-basic-layout {
        height: 100% !important;
      }
    `,
  ],
})
export class BasicLayoutComponent {
  #_breakpointObserver = inject(BreakpointObserver);
  private _snackBar = inject(MatSnackBar);
  currentScreenSize: string = '';

  routes = [
    {
      name: 'contacts',
      route: 'contacts',
    },
    {
      name: 'scrumboard',
      route: 'scrumboard',
    },
  ];

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor() {
    this.#_breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  // @HostListener('window:keydown', ['$event'])
  private _bigFont(event: KeyboardEvent) {
    event.preventDefault();
    let keys = '';
    if (event.altKey) keys += ' alt ';
    if (event.ctrlKey) keys += ' ctrl ';
    if (event.shiftKey) keys += ' shift ';
    if (event.key) keys += event.key;

    if (
      (event.altKey || event.shiftKey || event.ctrlKey) &&
      event.key !== 'Control' &&
      event.key !== 'Shift' &&
      event.key !== 'Alt'
    )
      this._snackBar.open(keys, 'dismiss', {
        // duration: 1500,
        panelClass: ['font-extrabold'],
      });
  }
}
