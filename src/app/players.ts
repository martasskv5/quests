import { Injectable, inject } from '@angular/core';
import { Player, playerLevels, PlayerLevel } from './modules';

@Injectable({
    providedIn: 'root',
})
export class PlayersService {
    private players: Player[] = [
        {
            id: '019acb0a-e611-77d6-ae74-eb13b6fccdfb',
            username: 'Hero123',
            xp: 1200,
            // resolved at runtime by ClanService; avoid injecting ClanService here to prevent circular DI
            clan: undefined,
            profilePictureUrl: undefined,
            questsList: [
                {
                    id: '019acb05-85f9-796c-b8fd-44adf2739f7d',
                    title: 'Find the Lost Sword',
                    description: 'Retrieve the legendary sword from the ancient ruins.',
                    completed: false,
                    xp: 100,
                },
                {
                    id: '019acb05-a8a6-766b-9bfb-d17b8afc5961',
                    title: 'Rescue the Villagers',
                    description: 'Save the villagers captured by goblins.',
                    completed: true,
                    xp: 200,
                },
                {
                    id: '019acb05-debf-742d-a674-9cc4106f7511',
                    title: 'Collect Herbs',
                    description: 'Gather 10 healing herbs for the village healer.',
                    completed: false,
                    xp: 50,
                },
                {
                    id: '019acb05-f7ff-783b-b459-8999ea2c3df2',
                    title: 'Defeat the Dragon',
                    description: 'Slay the dragon terrorizing the village.',
                    completed: false,
                    xp: 500,
                },
                {
                    id: '019acb06-057d-79b1-8596-dd50a3c7c92f',
                    title: 'Explore the Cave',
                    description: 'Investigate the mysterious cave near the village.',
                    completed: true,
                    xp: 150,
                },
            ],
        },
    ];

    constructor() {
        console.info(
            '%c PlayersService initialized',
            'color: white; padding: 15px; border: 1px solid green; background-color: green;'
        );
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getPlayerByUsername(username: string): Player {
        return this.players.find((player) => player.username === username) as Player;
    }

    getPlayerById(id: string): Player {
        return this.players.find((player) => player.id === id) as Player;
    }

    getPlayerLevel(player: string): PlayerLevel {
        const p = this.getPlayerByUsername(player);
        let level: PlayerLevel = playerLevels[0];
        for (const l of playerLevels) {
            if (p.xp >= l.xpRequired) {
                level = l;
            } else {
                break;
            }
        }
        return level;
    }

    deletePlayerByUsername(username: string): void {
        this.players = this.players.filter((player) => player.username !== username);
    }
}
