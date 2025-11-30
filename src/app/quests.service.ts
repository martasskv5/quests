import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Quest } from './modules';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class QuestsService {
    private quests: WritableSignal<Quest[]> = signal([]);
    private http = inject(HttpClient);
    private url = 'http://localhost:3000/quests';
    constructor() {
        console.info(
            '%c QuestsService initialized',
            'color: white; padding: 15px; border: 1px solid blue; background-color: blue;'
        );
        this.http.get<Quest[]>(this.url).subscribe((data) => {
            console.log('[QuestsService] loaded quests', data);
            this.quests.set(data);
        });
    }


    getQuests(): Quest[] {
        return this.quests();
    }

    getQuestById(id: string): Quest {
        return this.quests().find((quest) => quest.id === id) as Quest;
    }

    addQuest(quest: Quest): void {
        this.quests.update((quests) => [...quests, quest]);

        // update database
        this.http.post<Quest>(this.url, quest).subscribe((data) => {
            console.log('[QuestsService] added quest', data);
        });
    }
}
