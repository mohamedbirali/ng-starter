import { User, UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface IAuthService {
  connectedUser$(): Observable<User | null>;

  registerEmailPassword$(email: string, password: string): Observable<boolean>;

  sendEmailVerification$(): Observable<Promise<void>>;

  resetPassword$(email: string): Observable<Promise<void>>;

  registerLoginGoogle$(): Observable<Promise<UserCredential>>;

  registerLoginGithub$(): Observable<Promise<UserCredential>>;

  loginEmailPassword$(
    email: string,
    pwd: string,
  ): Observable<Promise<UserCredential>>;

  updateUserProfile$(user: User): Observable<Promise<void>>;

  updateEmail$(email: string): Observable<Promise<void>>;

  reAuthenticate$(): Observable<void>;

  logout$(): Observable<Promise<void>>;

  deleteUser$(): Observable<Promise<void>>;
}
