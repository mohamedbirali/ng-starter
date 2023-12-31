import { CanDeactivateFn } from '@angular/router';

export const authDesactivateGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  return true;
};
