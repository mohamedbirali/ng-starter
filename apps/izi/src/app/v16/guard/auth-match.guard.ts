import { CanMatchFn } from '@angular/router';

export const authMatchGuard: CanMatchFn = (route, segments) => {
  return true;
};
