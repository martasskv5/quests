import { Injectable } from '@angular/core';
import { Quest } from './modules';

@Injectable({
    providedIn: 'root',
})
export class QuestsService {
    constructor() {
        console.info(
            '%c QuestsService initialized',
            'color: white; padding: 15px; border: 1px solid blue; background-color: blue;'
        );
    }

    private quests: Quest[] = [
        {
            id: 1,
            title: 'Find the Lost Sword',
            description: 'Retrieve the legendary sword from the ancient ruins.',
            completed: false,
            xp: 100,
        },
        {
            id: 2,
            title: 'Rescue the Villagers',
            description: 'Save the villagers captured by goblins.',
            completed: true,
            xp: 200,
        },
        {
            id: 3,
            title: 'Collect Herbs',
            description: 'Gather 10 healing herbs for the village healer.',
            completed: false,
            xp: 50,
        },
        {
            id: 4,
            title: 'Defeat the Dragon',
            description: 'Slay the dragon terrorizing the village.',
            completed: false,
            xp: 500,
        },
        {
            id: 5,
            title: 'Explore the Cave',
            description: 'Investigate the mysterious cave near the village.',
            completed: true,
            xp: 150,
        }
    ];

    getQuests(): Quest[] {
        return this.quests;
    }

    getQuestById(id: number): Quest {
        return this.quests.find((quest) => quest.id === id) as Quest;
    }

    addQuest(quest: Quest): void {
        this.quests.push(quest);
    }
}
