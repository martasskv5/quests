import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Clan } from './modules';
import { Firestore, collection, getDocs, doc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { FirestoreService } from './firestoreAPI';

@Injectable({
    providedIn: 'root',
})
export class ClanService {
    // avoid injecting PlayersService here to prevent a circular dependency
    // initial data should not reference PlayersService directly
    private firestoreService = inject(FirestoreService);
    private clansSignal: WritableSignal<Clan[]> = signal([]);
    private readonly collectionName = 'clans';

    constructor() {
        this.loadClans();
    }

    private loadClans(): void {
        const clansData = this.firestoreService.loadCollection<Clan>(this.collectionName);
        this.clansSignal = clansData;
    }
    

    addClan(clan: Clan): void {
        this.clansSignal.update((list) => [...list, clan]);

        this.firestoreService.addDocument(this.collectionName, clan).then(
            (id) => {
                console.log('[ClanService] added clan with id:', id);
                this.loadClans();
            },
            (error) => {
                console.error('[ClanService] error adding clan:', error);
                this.loadClans();
            }
        );
    }

    getClans(): Clan[] {
        return this.clansSignal();
    }

    getClanByName(name: string): Clan {
        return this.clansSignal().find((clan) => clan.name === name) as Clan;
    }

    deleteClanById(id: string): void {
        this.clansSignal.update((list) => list.filter((clan) => clan.id !== id));

        this.firestoreService.deleteDocument(this.collectionName, id).then(
            () => {
                console.log(`[ClanService] deleted clan with id: ${id}`);
            },
            (error: any) => {
                console.error('[ClanService] error deleting clan:', error);
                this.loadClans();
            }
        );
    }

    addPlayerToClan(clanId: string, playerId: string): void {
        // Local update: ensure we store player id strings
        this.clansSignal.update((list) =>
            list.map((clan) => (clan.id === clanId ? { ...clan, players: [...clan.players, playerId] } : clan))
        );

        // Server update: fetch clan, append player id, then update
        const clan = this.clansSignal().find((c) => c.id === clanId);
        if (clan) {
            this.firestoreService.updateDocument(this.collectionName, clanId, { 
                players: [...clan.players, playerId] 
            }).then(
                () => {
                    console.log(`[ClanService] added player to clan on server: ${clanId}`);
                },
                (error: any) => {
                    console.error('[ClanService] error adding player to clan:', error);
                    this.loadClans();
                }
            );
        }
    }

    deletePlayerFromClan(clanId: string, playerId: string): void {
        this.clansSignal.update((list) =>
            list.map((clan) =>
                clan.id === clanId ? { ...clan, players: clan.players.filter((p: any) => p !== playerId) } : clan
            )
        );

        // Server update: fetch clan, remove player id, then update
        const clan = this.clansSignal().find((c) => c.id === clanId);
        if (clan) {
            const updatedPlayers = clan.players.filter((p: any) => p !== playerId);
            this.firestoreService.updateDocument(this.collectionName, clanId, { 
                players: updatedPlayers 
            }).then(
                () => {
                    console.log(`[ClanService] deleted player ${playerId} from clan on server: ${clanId}`);
                },
                (error: any) => {
                    console.error('[ClanService] error deleting player from clan:', error);
                    this.loadClans();
                }
            );
        }
    }
}
