import { Route } from '@angular/router';
import { inputResolver } from './v16/input/input.resolver';

export const appRoutes: Route[] = [
  {
    path: 'signal',
    loadComponent: () =>
      import('./v16/reactivity/signal/signal.component').then(
        (c) => c.SignalComponent,
      ),
  },
  {
    path: 'form-signal',
    loadComponent: () =>
      import('./v16/reactivity/form-control/form-signal.component').then(
        (c) => c.FormSignalComponent,
      ),
  },
  {
    path: 'state-signal',
    loadComponent: () =>
      import('./v16/state-signal/state-signal.component').then(
        (c) => c.StateSignalComponent,
      ),
  },
  {
    path: 'render',
    loadComponent: () =>
      import('./v16/hook/render.component').then((c) => c.RenderComponent),
  },
  {
    path: 'ng-container', // ngIf, *ngFor
    loadComponent: () =>
      import('./v16/template/template-directive.component').then(
        (c) => c.TemplateDirectiveComponent,
      ),
  },
  {
    path: 'destroy',
    loadComponent: () =>
      import('./v16/hook/destory.component').then((c) => c.DestoryComponent),
  },
  {
    path: 'destroy-parent',
    loadComponent: () =>
      import('./v16/hook/destroy-parent.component').then(
        (c) => c.DestroyParentComponent,
      ),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./v16/input/input.component').then((c) => c.InputComponent),
    resolve: {
      fromResolver: inputResolver,
    },
    data: {
      fromData: 'From data',
    },
  },
];
