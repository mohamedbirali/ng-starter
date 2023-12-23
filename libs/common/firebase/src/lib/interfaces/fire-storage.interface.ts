import { Observable } from 'rxjs';

export interface IFirestorageService {
  uploadImage$(image: File, path: string): Observable<string>;

  dowloadFile$(url: string): Observable<void>;

  deleteFile$(path: string): Observable<void>;
}
