import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
  UploadResult,
} from '@angular/fire/storage';

export abstract class FireStorageAbstract {
  constructor(private _storage: Storage) {}

  async uploadImage$(file: File, path: string) {
    const uploadedFile: UploadResult = await uploadBytes(
      this.#storageRef(path),
      file,
    );
    return await getDownloadURL(uploadedFile.ref);
  }

  #storageRef(path: string) {
    return ref(this._storage, path);
  }
}
