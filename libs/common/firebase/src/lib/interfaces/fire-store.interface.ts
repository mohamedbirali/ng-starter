import {
  DocumentData,
  DocumentReference,
  WhereFilterOp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export type TFireQuery = {
  fieldName: string;
  operation: WhereFilterOp;
  value: string | boolean | number;
};

export interface IFirestoreService {
  addDoc$(
    collectionName: string,
    docData: Record<string, any>,
  ): Observable<Promise<DocumentReference>>;

  getDoc$(
    collectionName: string,
    pathToId: string,
  ): Observable<DocumentData | undefined>;

  getCollection$(collectionName: string): Observable<any>;

  queryCollection$<R>(
    collectionName: string,
    path: string,
    fireQuery: TFireQuery,
  ): Observable<R>;

  updateDoc$(
    collectionName: string,
    pathToId: string,
    docData: Record<string, any>,
  ): Observable<any>;

  deleteDoc$(collectionName: string, pathToId: string): Observable<any>;
}

export interface IFirestoreSeed {
  seed(data: Record<string, any>): Observable<any>;
}
