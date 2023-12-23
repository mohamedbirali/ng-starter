import { Auth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { FireAuthAbstract } from '../abstracts';

@Injectable({ providedIn: 'root' })
export class FireAuthService extends FireAuthAbstract {
  constructor(auth: Auth) {
    super(auth);
  }
}
