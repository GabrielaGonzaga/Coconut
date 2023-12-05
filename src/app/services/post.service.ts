import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  currentUser: User | null | undefined;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.afAuth.authState.subscribe(user => this.currentUser = user);
  }

  getAllPosts(): Observable<any> {
    return this.afs.collection<any>('posts', ref => ref.orderBy('time', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(item => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            };
          });
        })
      );
  }

  postMessage(message: string, ownerName: string, otherItem: any): void {
    this.afs.collection('posts').add({
      message,
      title: ownerName,
      user_id: this.currentUser?.uid, // Use optional chaining operator
      time: firebase.firestore.FieldValue.serverTimestamp(), // Access FieldValue from firebase.firestore
      ...otherItem,
    }).then(res => console.log(res));
  }
  
}
