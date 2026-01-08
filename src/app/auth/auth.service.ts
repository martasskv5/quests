import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  AuthError,
} from '@angular/fire/auth';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    this.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      switchMap((userCredential) => {
        return from(userCredential.user.getIdTokenResult()).pipe(
          tap((tokenResult) => {
            const user: User = {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: userCredential.user.displayName,
              photoURL: userCredential.user.photoURL,
            };
            this.currentUserSubject.next(user);
          }),
          switchMap((tokenResult) => {
            const response: AuthResponse = {
              accessToken: tokenResult.token,
              expiresIn: Math.floor((new Date(tokenResult.expirationTime).getTime() - Date.now()) / 1000),
              refreshToken: this.auth.currentUser?.refreshToken || '',
            };
            return from(Promise.resolve(response));
          })
        );
      }),
      catchError((error: AuthError) => this.handleAuthError(error))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return from(
      createUserWithEmailAndPassword(this.auth, data.email, data.password)
    ).pipe(
      switchMap((userCredential) => {
        const displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        if (displayName) {
          return from(updateProfile(userCredential.user, { displayName })).pipe(
            switchMap(() => {
              return from(userCredential.user.getIdTokenResult()).pipe(
                tap((tokenResult) => {
                  const user: User = {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: userCredential.user.displayName,
                    photoURL: userCredential.user.photoURL,
                  };
                  this.currentUserSubject.next(user);
                }),
                switchMap((tokenResult) => {
                  const response: AuthResponse = {
                    accessToken: tokenResult.token,
                    expiresIn: Math.floor((new Date(tokenResult.expirationTime).getTime() - Date.now()) / 1000),
                    refreshToken: this.auth.currentUser?.refreshToken || '',
                  };
                  return from(Promise.resolve(response));
                })
              );
            })
          );
        } else {
          return from(userCredential.user.getIdTokenResult()).pipe(
            tap((tokenResult) => {
              const user: User = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
              };
              this.currentUserSubject.next(user);
            }),
            switchMap((tokenResult) => {
              const response: AuthResponse = {
                accessToken: tokenResult.token,
                expiresIn: Math.floor((new Date(tokenResult.expirationTime).getTime() - Date.now()) / 1000),
                refreshToken: this.auth.currentUser?.refreshToken || '',
              };
              return from(Promise.resolve(response));
            })
          );
        }
      }),
      catchError((error: AuthError) => this.handleAuthError(error))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      catchError((error: AuthError) => this.handleAuthError(error))
    );
  }

  async getToken(): Promise<string | null> {
    if (!this.auth.currentUser) {
      return null;
    }
    try {
      return await this.auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Failed to get token', error);
      return null;
    }
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  private handleAuthError(error: AuthError): Observable<never> {
    let message = 'An error occurred during authentication';

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'Email already in use';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email format';
        break;
      default:
        message = error.message;
    }

    console.error('Auth error:', message, error);
    return throwError(() => new Error(message));
  }
}
