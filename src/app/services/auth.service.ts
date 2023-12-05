import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { User } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  private _userData: Observable<User | null>;

  private currentUser: UserData | undefined| null = null;
  private currentUser$ = new BehaviorSubject<UserData | null>(null);
  private unsubscribe$ = new Subject<void>();
  userData: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this._userData = afAuth.authState;
  
    this._userData.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user) {
        this.afs.collection<UserData>('users')
          .doc<UserData>(user.uid)
          .valueChanges()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(currentUser => {
            this.currentUser = currentUser || null; // Handle undefined by providing a default value of null
            this.currentUser$.next(currentUser || null);
          });
      }
    });
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  CurrentUser(): Observable<UserData | null> {
    return this.currentUser$.asObservable();
  }

  SignUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar = 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'
  ): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res && res.user) {
          const user: UserData = {
            firstName,
            lastName,
            email,
            avatar,
            id: res.user.uid,
          };

          this.afs.collection('users').doc(res.user.uid)
            .set(user)
            .then(() => {
              this.currentUser$.next(user);
            });
        }
      })
      .catch(err => console.error(`Something went wrong during sign up: ${err.message}`));
  }

  SignIn(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res && res.user) {
          this._userData = this.afAuth.authState;
  
          this.afs.collection<UserData>('users')
            .doc<UserData>(res.user.uid)
            .valueChanges()
            .subscribe((user) => {
              if (user) {
                this.currentUser = user;
                this.currentUser$.next(this.currentUser);
              } else {
                console.error('User data not found');
              }
            });
        }
      })
      .catch(err => console.error(`Something went wrong during sign in: ${err.message}`));
  }
  

  Logout(): void {
    this.afAuth.signOut().then(() => {
      this.currentUser = null;
      this.currentUser$.next(this.currentUser);
      this.router.navigateByUrl('/login').then();
    })
    .catch(err => console.error(`Error during logout: ${err.message}`));
  }

  searchUserInDatabase(user_id: string): Observable<UserData | undefined> {
    return this.afs.collection<UserData>('users').doc<UserData>(user_id).valueChanges();
  }

}

export interface UserData {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  id?: string;
}
