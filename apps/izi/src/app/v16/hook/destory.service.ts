import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable()
export class DestoryService {
  get mockData$() {
    return from(['c', 'h', 'i', 'l', 'd']);
  }
}
