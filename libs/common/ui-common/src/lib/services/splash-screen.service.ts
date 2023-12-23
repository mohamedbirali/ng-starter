import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SplashScreenService {
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
  ) {
    // Hide it on the first NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        this.hide();
      });
  }

  show(): void {
    this._document.body.classList.remove('splash-screen-hidden');
  }

  hide(): void {
    this._document.body.classList.add('splash-screen-hidden');
  }
}
