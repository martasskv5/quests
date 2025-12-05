import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Quest } from './modules';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { FirestoreService } from './firestoreAPI';

@Injectable({
    providedIn: 'root',
})
export class QuestsService {
    private quests: WritableSignal<Quest[]> = signal([]);
    private firestoreService = inject(FirestoreService);
    private readonly collectionName = 'quests';

    constructor() {
        console.info(
            '%c QuestsService initialized',
            'color: white; padding: 15px; border: 1px solid blue; background-color: blue;'
        );
        this.loadQuests();
    }

    private loadQuests(): void {
        const questsData = this.firestoreService.loadCollection<Quest>(this.collectionName);
        this.quests = questsData;
    }

    getQuests(): Quest[] {
        return this.quests();
    }

    getQuestById(id: string): Quest {
        return this.quests().find((quest) => quest.id === id) as Quest;
    }

    addQuest(quest: Quest): void {
        this.quests.update((quests) => [...quests, quest]);

        this.firestoreService.addDocument(this.collectionName, quest).then(
            (id) => {
                console.log('[QuestsService] added quest with id:', id);
                this.loadQuests();
            },
            (error) => {
                console.error('[QuestsService] error adding quest:', error);
                this.loadQuests();
            }
        );
    }
}
