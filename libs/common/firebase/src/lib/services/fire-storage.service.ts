import { FireStorageAbstract } from '../abstracts';
import { Storage } from '@angular/fire/storage';
export class FireStorageService extends FireStorageAbstract {
  constructor(storage: Storage) {
    super(storage);
  }
}
