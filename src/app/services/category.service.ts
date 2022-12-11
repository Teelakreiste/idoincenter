import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private angularFirestore: AngularFirestore) { }

  getCategories() {
    return this.angularFirestore.collection('categories').snapshotChanges();
  }

  getCategory(id: string) {
    return this.angularFirestore.collection('categories').doc(id).valueChanges();
  }
  
  async createCategory(category: any) {
    return await this.angularFirestore.collection('categories').add(category);
  }

  async updateCategory(id: string, category: any) {
    return await this.angularFirestore.collection('categories').doc(id).set(category);
  }

  async deleteCategory(id: string) {
    return await this.angularFirestore.collection('categories').doc(id).delete();
  }


  searchCategory(searchText: string) {
    return this.angularFirestore.collection('categories', ref => ref.where('name', '>=', searchText).where('name', '<=', searchText + '\uf8ff')).snapshotChanges();
  }
}
