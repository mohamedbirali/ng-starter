import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FireStoreAbstract } from '../abstracts';

@Injectable({ providedIn: 'root' })
export class FireStoreService extends FireStoreAbstract {
  constructor(_firestore: Firestore) {
    super(_firestore);
  }
}
