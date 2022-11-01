import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private angularFirestore: AngularFirestore) { }

  getProducts() {
    return this.angularFirestore.collection('products').snapshotChanges();
  }

  getProduct(id: string) {
    return this.angularFirestore.collection('products').doc(id).valueChanges();
  }

  async createProduct(product: any) {
    return await this.angularFirestore.collection('products').add(product);
  }

  async updateProduct(id: string, product: any) {
    return await this.angularFirestore.collection('products').doc(id).set(product);
  }

  async deleteProduct(id: string) {
    return await this.angularFirestore.collection('products').doc(id).delete();
  }
}
