import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: 'AIzaSyBOXxME5Jfde82fJWW6xAGcL4K0oVFXKI4',
  authDomain: 'appslab-quests.firebaseapp.com',
  projectId: 'martas-appslab-quests',
  storageBucket: 'appslab-quests.firebasestorage.app',
  messagingSenderId: '836862033055',
  appId: '1:836862033055:web:36f4f71c0c9b95fb2d7d96',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
  ],
};
