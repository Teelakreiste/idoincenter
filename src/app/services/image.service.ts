import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  constructor(private angularFireStorage: AngularFireStorage) { }

  uploadImage(path: string, image: File) {
    return this.angularFireStorage.upload(path, image);
  }

  getRef(path: string) {
    return this.angularFireStorage.ref(path);
  }

  deleteImageByUrl(url: string) {
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }
}
