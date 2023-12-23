import { HelperDateService } from '@feature-common';
import { Injectable, inject } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { TUser } from '@auth/data-access-auth';
import { FireAuthService, FireStoreService } from '@firebase';

@Injectable({ providedIn: 'root' })
export class AuthFireFacade {
  #_router = inject(Router);
  #_activatedRoute = inject(ActivatedRoute);
  #_fireAuthService = inject(FireAuthService);
  #_fireStoreService = inject(FireStoreService);

  #_helperDateService = new HelperDateService();

  #users = 'users';

  async registerEmail(user: TUser) {
    const _user = await this.#_fireAuthService.createUserWithEmailAndPassword(
      user,
    );

    await this.#createUser(_user);

    if (_user.user) {
      this.#redirect();
    }
  }

  async registerGoogle(event: void) {
    const _user = await this.#_fireAuthService.signInWithPopupGoogle();
    if (_user?.user) {
      await this.#createUser(_user);

      this.#redirect();
    }
  }

  async registerGithub(event: void) {
    const _user = await this.#_fireAuthService.signInWithPopupGithub();
    if (_user?.user) {
      await this.#createUser(_user);

      this.#redirect();
    }
  }

  async loginEmail(user: TUser) {
    const _user = await this.#_fireAuthService.signInWithEmailAndPassword(user);
    if (_user?.user) {
      this.#createUser(_user);
      this.#redirect();
    }
  }

  async logout() {
    await this.#_fireAuthService.signOut();
    this.#_router.navigateByUrl('login');
  }

  async forgotPassword(email: string) {
    await this.#_fireAuthService.sendPasswordResetEmail(email);
  }

  async #createUser(user: UserCredential) {
    const {
      displayName,
      email,
      emailVerified,
      phoneNumber,
      photoURL,
      uid,
      isAnonymous,
      tenantId,
    } = user.user;

    await this.#_fireStoreService.setData(
      `${this.#users}`,
      {
        displayName,
        email,
        emailVerified,
        phoneNumber,
        avatar: photoURL,
        isAnonymous,
        tenantId,
        providerId: user.providerId,
        role: 'admin',
        permission: '*',
        updatedAt: this.#_helperDateService.format(new Date()),
      },
      uid,
    );
  }

  async #isUserExists(path: string, uid: string) {
    return (await this.#_fireStoreService.getDoc(path, uid)).exists();
  }

  #redirect() {
    const redirectURL =
      this.#_activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
      '/signed-in-redirect';

    // Navigate to the redirect url
    this.#_router.navigateByUrl(redirectURL);
  }
}
