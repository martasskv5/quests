import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Player, playerLevels, PlayerLevel } from './modules';
import { HttpClient } from '@angular/common/http';
import { ClanService } from './clans';

@Injectable({
    providedIn: 'root',
})
export class PlayersService {
    private players: WritableSignal<Player[]> = signal([]);
    private clanService = inject(ClanService);
    url = 'http://localhost:3000/players';
    private http = inject(HttpClient);

    constructor() {
        console.info(
            '%c PlayersService initialized',
            'color: white; padding: 15px; border: 1px solid green; background-color: green;'
        );
        this.http.get<Player[]>(this.url).subscribe((data) => {
            console.log('[PlayersService] loaded players', data);
            // After loading players, load clans for each player
            data.forEach((player) => {
                if (player.clan) {
                    console.log(this.clanService.getClans());
                    const clan = this.clanService.getClanByName(player.clan as unknown as string);
                    
                    if (clan) {
                        console.log(
                            `[PlayersService] associating player ${player.username} with clan ${clan.name}`
                        );
                        // Here you could add logic to associate the player with the clan if needed
                        player.clan = clan;
                    }
                }
            });
            this.players.set(data);
        });
    }

    addPlayer(player: Player): void {
        this.players.update((list) => [...list, player]);

        // update database
        this.http.post<Player>(this.url, player).subscribe((data) => {
            console.log('[PlayersService] added player', data);
        });
    }

    getPlayers(): Player[] {
        return this.players();
    }

    getPlayerByUsername(username: string): Player {
        return this.players().find((player) => player.username === username) as Player;
    }

    getPlayerById(id: string): Player {
        return this.players().find((player) => player.id === id) as Player;
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

    deletePlayerById(id: string): void {
        this.players.update((list) => list.filter((player) => player.id !== id));
        // update database
        this.http.delete(`${this.url}/${id}`).subscribe(() => {
            console.log('[PlayersService] deleted player with id', id);
        });
    }
}
