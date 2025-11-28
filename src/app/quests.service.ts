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
            id: "019acb05-85f9-796c-b8fd-44adf2739f7d",
            title: 'Find the Lost Sword',
            description: 'Retrieve the legendary sword from the ancient ruins.',
            completed: false,
            xp: 100,
        },
        {
            id: "019acb05-a8a6-766b-9bfb-d17b8afc5961",
            title: 'Rescue the Villagers',
            description: 'Save the villagers captured by goblins.',
            completed: true,
            xp: 200,
        },
        {
            id: "019acb05-debf-742d-a674-9cc4106f7511",
            title: 'Collect Herbs',
            description: 'Gather 10 healing herbs for the village healer.',
            completed: false,
            xp: 50,
        },
        {
            id: "019acb05-f7ff-783b-b459-8999ea2c3df2",
            title: 'Defeat the Dragon',
            description: 'Slay the dragon terrorizing the village.',
            completed: false,
            xp: 500,
        },
        {
            id: "019acb06-057d-79b1-8596-dd50a3c7c92f",
            title: 'Explore the Cave',
            description: 'Investigate the mysterious cave near the village.',
            completed: true,
            xp: 150,
        },
    ];

    getQuests(): Quest[] {
        return this.quests;
    }

    getQuestById(id: string): Quest {
        return this.quests.find((quest) => quest.id === id) as Quest;
    }

    addQuest(quest: Quest): void {
        this.quests.push(quest);
    }
}
