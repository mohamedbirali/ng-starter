import { ResolveFn } from '@angular/router';

export const inputResolver: ResolveFn<string> = (route, state) => {
  // eslint should be
  route;
  state;
  return 'From resolver';
};
