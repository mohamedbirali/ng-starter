import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { endVev } from 'apps/izi/src/env/env.dev';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // env
  #url = endVev.baseUrl;

  // injections
  #_http = inject(HttpClient); // same as: constructor(private _url: HttpClient) {}

  // target
  #users = 'users';

  // public methods
  getAll(): Observable<User[]> {
    return this.#_http.get<User[]>(`${this.#url}/${this.#users}`);
  }
}
