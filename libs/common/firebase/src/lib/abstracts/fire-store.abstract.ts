import {
  Firestore,
  QueryConstraint,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { omit } from 'lodash';
import { TFireQuery } from '../interfaces';
import { TRecord } from '../interfaces/firebase.interface';

export abstract class FireStoreAbstract {
  #id: string = 'id';

  constructor(private _firestore: Firestore) {}

  getCollection$(path: string) {
    return collectionData(this.#collectionRef(path), { idField: this.#id });
  }

  getDoc$(path: string, id: string) {
    return docData(this.#doc(path, id), { idField: this.#id });
  }

  queryCollection$(
    path: string,
    fireQuery?: TFireQuery,
    ...queryConstraints: QueryConstraint[]
  ) {
    return collectionData(
      query(
        this.#collectionRef(path),
        this.#whereOperations(fireQuery),
        ...queryConstraints,
      ),
      { idField: this.#id },
    );
  }

  async addDoc(path: string, data: TRecord) {
    return await addDoc(this.#collectionRef(path), data);
  }

  async getDoc(path: string, uid: string) {
    return getDoc(this.#doc(path, uid));
  }

  /**
   *
   * @param path
   * @param data should contain 'uid' prop
   */
  async setData(path: string, data: TRecord, id: string) {
    await setDoc(this.#doc(path, id), data, { merge: true });
  }

  async updateDoc(path: string, docData: TRecord, id: string) {
    return await updateDoc(this.#doc(path, id), omit(docData, ['id']));
  }

  async updateMany() {
    const batch = writeBatch(this._firestore);
  }

  async deleteDoc(path: string, id: string) {
    return await deleteDoc(this.#doc(path, id));
  }

  #collectionRef(path: string) {
    return collection(this._firestore, path);
  }

  #doc(path: string, id: string) {
    return doc(this.#collectionRef(path), id);
  }

  #whereOperations(fireQuery?: TFireQuery) {
    return where(fireQuery!.fieldName, fireQuery!.operation, fireQuery!.value);
  }
}
