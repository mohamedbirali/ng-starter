import { Observable, of } from 'rxjs';
import {
  IFirestoreService,
  TFireQuery,
} from '../interfaces/fire-store.interface';
import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AbstractFirestore implements IFirestoreService {
  #_firestore = inject(Firestore);

  addDoc$(
    collectionName: string,
    docData: Record<string, any>,
  ): Observable<Promise<DocumentReference>> {
    return of(
      addDoc(this.#_assignCollectionReference(collectionName), docData),
    );
  }

  getDoc$(collectionName: string, pathToId: string): Observable<any> {
    return docData(
      doc(this.#_assignCollectionReference(collectionName), pathToId),
      { idField: 'id' },
    );
  }

  getCollection$(collectionName: string): Observable<any> {
    return collectionData(this.#_assignCollectionReference(collectionName), {
      idField: 'id',
    });
  }

  updateDoc$(
    collectionName: string,
    pathToId: string,
    docData: Record<string, any>,
  ): Observable<any> {
    return of(
      updateDoc(
        doc(this.#_assignCollectionReference(collectionName), pathToId),
        docData,
      ),
    );
  }

  deleteDoc$(
    collectionName: string,
    pathToId: string,
  ): Observable<Promise<void>> {
    return of(
      deleteDoc(
        doc(this.#_assignCollectionReference(collectionName), pathToId),
      ),
    );
  }

  queryCollection$<R>(
    collectionName: string,
    path: string,
    fireQuery?: TFireQuery,
  ): Observable<any> {
    return collectionData(
      query(
        this.#_assignCollectionReference(collectionName, path),
        this.#whereOperations(fireQuery),
      ),
    );
  }

  // seed (data: object) {
  //   (
  //     ref(this.#_assignCollectionReference(collectionName),),
  //     object
  //   );
  // }

  #whereOperations(fireQuery?: TFireQuery) {
    return where(fireQuery!.fieldName, fireQuery!.operation, fireQuery!.value);
  }

  #_assignCollectionReference(
    collectionName: string,
    path?: string,
  ): CollectionReference<DocumentData> {
    return collection(this.#_firestore, collectionName);
  }
}
