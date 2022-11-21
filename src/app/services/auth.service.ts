import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authFirebase: AngularFireAuth) { }

  signIn(email: string, password: string) {
    return this.authFirebase.signInWithEmailAndPassword(email, password);
  }

  signUp(data: User) {
    return this.authFirebase.createUserWithEmailAndPassword(data.email, data.password);
  }

  signOut() {
    return this.authFirebase.signOut();
  }

  deleteUser() {
    return this.authFirebase.currentUser.then(user => user.delete());
  }

  stateUser() {
    return this.authFirebase.authState;
  }

  isLogged() {
    return this.authFirebase.currentUser;
  }

  async verifyOldPassword(oldPassword: string) {
    return this.signIn(await this.authFirebase.currentUser.then(user => user.email), oldPassword)?.then(() => true).catch(() => false);
  }

  changePassword(newPassword: string) {
    return this.authFirebase.currentUser.then(user => user.updatePassword(newPassword));
  }

}
