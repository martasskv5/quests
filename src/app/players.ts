import { Injectable, inject, signal, WritableSignal, effect } from '@angular/core';
import { Player, playerLevels, PlayerLevel } from './modules';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ClanService } from './clans';
import { FirestoreService } from './firestoreAPI';
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlayersService {
    private players: WritableSignal<Player[]> = signal([]);
    private clanService = inject(ClanService);
    private firestore = inject(Firestore);
    private firestoreService = inject(FirestoreService);
    private readonly collectionName = 'players';

    constructor() {
        console.info(
            '%c PlayersService initialized',
            'color: white; padding: 15px; border: 1px solid green; background-color: green;'
        );
        this.loadPlayers();
    }

    private loadPlayers(): void {
        const playersData = this.firestoreService.loadCollection<Player>(this.collectionName);
        this.players = playersData;
        
        // Watch for data changes and associate with clans
        effect(() => {
            const data = playersData();
            data.forEach((player) => {
                if (player.clan) {
                    const clan = this.clanService.getClanByName(player.clan as unknown as string);
                    if (clan) {
                        console.log(
                            `[PlayersService] associating player ${player.username} with clan ${clan.name}`
                        );
                        player.clan = clan;
                    }
                }
            });
        });
    }

    addPlayer(player: Player): void {
        this.players.update((list) => [...list, player]);

        this.firestoreService.addDocument(this.collectionName, player).then(
            (id) => {
                console.log('[PlayersService] added player with id:', id);
                this.loadPlayers();
            },
            (error) => {
                console.error('[PlayersService] error adding player:', error);
                this.loadPlayers();
            }
        );
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

        this.firestoreService.deleteDocument(this.collectionName, id).then(
            () => {
                console.log('[PlayersService] deleted player with id:', id);
            },
            (error) => {
                console.error('[PlayersService] error deleting player:', error);
                this.loadPlayers();
            }
        );
    }
};
