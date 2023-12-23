import { signal } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  updateCurrentUser,
  updateEmail,
  user,
  authState,
} from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

type TUser = {
  email: string;
  password: string;
};

export abstract class FireAuthAbstract {
  constructor(private _auth: Auth) {}
  async signInWithPopupGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();

    return await signInWithPopup(this._auth, provider);
  }

  async signInWithPopupGithub(): Promise<UserCredential> {
    const provider = new GithubAuthProvider();

    return await signInWithPopup(this._auth, provider);
  }

  async createUserWithEmailAndPassword(user: TUser): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password,
    );
  }

  async sendEmailVerification(): Promise<void> {
    return await sendEmailVerification(this._auth.currentUser!);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return await sendPasswordResetEmail(this._auth, email);
  }

  async signInWithEmailAndPassword(user: TUser): Promise<UserCredential> {
    return await signInWithEmailAndPassword(
      this._auth,
      user.email,
      user.password,
    );
  }

  async signOut() {
    await signOut(this._auth);
  }

  // user

  user$(): Observable<User | null> {
    return authState(this._auth).pipe(
      map((user: User | null) => {
        localStorage.setItem('userId', user?.uid ?? '');
        return user;
      }),
    );
    // return user(this._auth);
  }

  async updateUserProfile(user: User | null): Promise<void> {
    return await updateCurrentUser(this._auth, user);
  }

  async updateEmail(email: string): Promise<void> {
    return await updateEmail(this._auth.currentUser!, email);
  }

  async #reAuthenticate() {
    // return await reauthenticateWithCredential(this.auth.currentUser!, auth.currentUser.)
  }

  async deleteUser(): Promise<void> {
    try {
      return await deleteUser(this._auth.currentUser!);
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
