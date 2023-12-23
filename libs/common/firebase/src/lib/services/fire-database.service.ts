import { Injectable } from '@angular/core';
import { FireDatabaseAbstract } from '../abstracts';
import { Database } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class FireDatabaseService extends FireDatabaseAbstract {
  constructor(database: Database) {
    super(database);
  }
}
