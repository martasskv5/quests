import { Injectable, inject } from '@angular/core';
import { Player, Clan } from './modules';
import { ClanService } from './clans';

@Injectable({
    providedIn: 'root',
})
export class PlayersService {
    private clanService = inject(ClanService);
    private players: Player[] = [
        {
            id: 1,
            username: 'Hero123',
            level: 10,
            clan: this.clanService.getClanByName('Warriors'),
            profilePictureUrl: undefined,
            questsList: [
                {
                    id: 1,
                    title: 'Find the Lost Sword',
                    description: 'Retrieve the legendary sword from the ancient ruins.',
                    completed: false,
                    xp: 100,
                },
                {
                    id: 2,
                    title: 'Defeat the Dragon',
                    description: 'Slay the dragon terrorizing the village.',
                    completed: true,
                    xp: 300,
                },
                {
                    id: 3,
                    title: 'Rescue the Princess',
                    description: 'Save the princess from the evil warlock.',
                    completed: false,
                    xp: 200,
                }
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

    deletePlayerByUsername(username: string): void {
        this.players = this.players.filter((player) => player.username !== username);
    }
}
