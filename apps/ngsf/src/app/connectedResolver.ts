import { inject } from '@angular/core';
import { FireAuthService } from '@firebase';

export const connectedResolver = () => {
  return inject(FireAuthService).connectedUser$();
};
