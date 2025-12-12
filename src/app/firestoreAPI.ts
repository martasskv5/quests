import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import {
    Firestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    private firestore = inject(Firestore);

    loadCollection<T>(collectionName: string): WritableSignal<T[]> {
        const data: WritableSignal<T[]> = signal([]);
        const coll = collection(this.firestore, collectionName);
        from(getDocs(coll)).subscribe((snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
            console.log(`[FirestoreService] loaded ${collectionName}:`, docs);
            data.set(docs);
        });
        return data;
    }

    /**
     * Load a collection and hydrate a named subcollection for each document.
     * Useful when migrating from json-server structures where nested arrays were split into subcollections.
     */
    async loadCollectionWithSubcollection<T extends { id?: string }, S>(
        collectionName: string,
        subcollectionName: string
    ): Promise<(T & { [key: string]: S[] })[]> {
        const coll = collection(this.firestore, collectionName);
        const snapshot = await getDocs(coll);

        const results: (T & { [key: string]: S[] })[] = [];
        for (const docSnap of snapshot.docs) {
            const base: any = { id: docSnap.id, ...docSnap.data() };
            const subColl = collection(this.firestore, `${collectionName}/${docSnap.id}/${subcollectionName}`);
            const subSnap = await getDocs(subColl);
            base[subcollectionName] = subSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as S[];
            results.push(base as T & { [key: string]: S[] });
        }

        console.log(
            `[FirestoreService] loaded ${collectionName} with subcollection ${subcollectionName}:`,
            results
        );

        return results;
    }

    addDocument<T extends { id?: string }>(collectionName: string, data: T): Promise<string> {
        const coll = collection(this.firestore, collectionName);
        const { id, ...documentData } = data;
        
        // If data has an id, use it as the document ID
        if (id) {
            const docRef = doc(this.firestore, collectionName, id);
            return updateDoc(docRef, documentData).then(() => {
                console.log(`[FirestoreService] added document to ${collectionName} with id:`, id);
                return id;
            });
        }
        
        // Otherwise, let Firestore generate an ID
        return addDoc(coll, documentData as any).then((docRef) => {
            console.log(`[FirestoreService] added document to ${collectionName} with id:`, docRef.id);
            return docRef.id;
        });
    }

    deleteDocument(collectionName: string, docId: string): Promise<void> {
        const docRef = doc(this.firestore, collectionName, docId);
        return deleteDoc(docRef).then(() => {
            console.log(`[FirestoreService] deleted document from ${collectionName} with id:`, docId);
        });
    }

    updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
        const docRef = doc(this.firestore, collectionName, docId);
        return updateDoc(docRef, data).then(() => {
            console.log(`[FirestoreService] updated document in ${collectionName} with id:`, docId);
        });
    }
}