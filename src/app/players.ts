import { Injectable } from '@angular/core';
import { Player } from './modules';

@Injectable({
    providedIn: 'root',
})
export class PlayersService {
    private players: Player[] = [
        {
            id: 1,
            username: 'Hero123',
            level: 10,
            // clan: 'Warriors',
            // profilePictureUrl: 'assets/profiles/hero123.png',
            questsList: [
                {
                    id: 1,
                    title: 'Find the Lost Sword',
                    description: 'Retrieve the legendary sword from the ancient ruins.',
                    completed: false,
                    xp: 100,
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

    deletePlayerByUsername(username: string): void {
        this.players = this.players.filter((player) => player.username !== username);
    }
}
