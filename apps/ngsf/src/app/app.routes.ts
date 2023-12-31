import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@auth/data-access-auth';
import { BasicLayoutComponent } from '@common/ui-common';
import { LandingLayoutComponent } from './landing/landing.layout.component';
import { Page404Component } from './404/page.404.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full',
  },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'contacts' },
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LandingLayoutComponent, // temp
    loadChildren: () =>
      import('@ngs/feature-auth').then((r) => r.FEATURE_AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: BasicLayoutComponent,
    children: [
      {
        path: 'scrumboard',
        title: 'scrumboard',
        loadChildren: () =>
          import('@ngs/modules/scrumboard/feature-scrumboard').then(
            (r) => r.SCRUMBOARD_ROUTES,
          ),
      },
      {
        path: 'contacts',
        title: 'contacts',
        loadChildren: () =>
          import('@ngs/feature-contact').then((r) => r.FEATURE_CONTACT_ROUTES),
      },
      {
        path: '**',
        component: Page404Component,
      },
    ],
  },
];
