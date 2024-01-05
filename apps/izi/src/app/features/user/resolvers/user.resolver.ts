import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

export const usersResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  // notice that we inject a service without constructor
  const userService = inject(UserService);

  return userService.getAll();
};
