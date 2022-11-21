import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private angularFirestore: AngularFirestore) { }

  createDocument(data: any, collectionPath: string, documentId: string) {
    const collection = this.angularFirestore.collection(collectionPath);
    return collection.doc(documentId).set(data);
  }

  updateDocument(data: any, collectionPath: string, documentId: string) {
    const collection = this.angularFirestore.collection(collectionPath);
    return collection.doc(documentId).update(data);
  }

  deleteDocument(collectionPath: string, documentId: string) {
    const collection = this.angularFirestore.collection(collectionPath);
    return collection.doc(documentId).delete();
  }

  getCollection<type>(collectionPath: string) {
    const collection = this.angularFirestore.collection<type>(collectionPath);
    return collection.valueChanges();
  }

  getId() {
    return this.angularFirestore.createId();
  }

  getDocumentById<type>(collectionPath: string, documentId: string) {
    return this.angularFirestore.collection(collectionPath).doc<type>(documentId).valueChanges();
  }

  getDocuments<type>(collectionPath: string) {
    return this.angularFirestore.collection<type>(collectionPath).snapshotChanges();
  }
}
