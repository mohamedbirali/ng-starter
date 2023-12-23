import {
  Database,
  limitToFirst,
  listVal,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from '@angular/fire/database';
import { TRecord } from '../interfaces/firebase.interface';

export abstract class FireDatabaseAbstract {
  constructor(private _database: Database) {}

  getObjects$<N>(path: string) {
    return listVal<N[]>(this.#databaseRef(path));
  }

  queryObjects$<N>(path: string) {
    return listVal<N[]>(query(this.#databaseRef(path), limitToFirst(20)));
  }

  async addObject(path: string, data: TRecord) {
    const id = push(this.#databaseRef(path)).key;
    return await set(this.#databaseRef(`${path}/${id}`), data);
  }

  async updateObject(path: string, data: TRecord) {
    return await set(this.#databaseRef(path), data);
  }

  async updateMany(path: string, data: TRecord) {
    return await update(this.#databaseRef(path), data);
  }

  async deleteObject(path: string) {
    return await remove(this.#databaseRef(path));
  }

  #databaseRef(path: string) {
    return ref(this._database, path);
  }
}
