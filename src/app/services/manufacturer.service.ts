import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private angularFirestore: AngularFirestore) { }

  getManufacturers() {
    return this.angularFirestore.collection('manufacturers').snapshotChanges();
  }

  getManufacturer(id: string) {
    return this.angularFirestore.collection('manufacturers').doc(id).valueChanges();
  }

  async createManufacturer(manufacturer: any) {
    return await this.angularFirestore.collection('manufacturers').add(manufacturer);
  }

  async updateManufacturer(id: string, manufacturer: any) {
    return await this.angularFirestore.collection('manufacturers').doc(id).set(manufacturer);
  }

  async deleteManufacturer(id: string) {
    return await this.angularFirestore.collection('manufacturers').doc(id).delete();
  }
  
}
