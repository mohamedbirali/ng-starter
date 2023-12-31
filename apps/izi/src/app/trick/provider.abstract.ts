import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

const ENVIRONMENT = new InjectionToken('env here');
const MockService = () => new InjectionToken('MockService');
const RealService = () => new InjectionToken('RealService');

@Injectable({
  providedIn: 'root',
  useFactory: inject(ENVIRONMENT) // if mock
    ? inject(MockService)
    : inject(RealService),
})
export abstract class AbstractProvider<T> {
  abstract loadOne(id: number): Observable<T>;
  abstract loadAll(id: number): Observable<T[]>;
}
