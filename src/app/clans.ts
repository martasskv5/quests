import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Clan } from './modules';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ClanService {
    // avoid injecting PlayersService here to prevent a circular dependency
    // initial data should not reference PlayersService directly
    private http = inject(HttpClient);
    // store clans in a signal so consumers can react when the HTTP load finishes
    private clansSignal: WritableSignal<Clan[]> = signal([]);
    url = 'http://localhost:3000/clans';

    constructor() {
        this.http.get<Clan[]>(this.url).subscribe((data) => {
            console.log('[ClanService] loaded clans', data);
            this.clansSignal.set(data);
        });
    }

    addClan(clan: Clan): void {
        this.clansSignal.update((list) => [...list, clan]);

        // updata database
        this.http.post<Clan>(this.url, clan).subscribe((data) => {
            console.log('[ClanService] added clan', data);
        });
    }

    getClans(): Clan[] {
        return this.clansSignal();
    }

    getClanByName(name: string): Clan {
        return this.clansSignal().find((clan) => clan.name === name) as Clan;
    }

    deleteClanById(id: string): void {
        this.clansSignal.update((list) => list.filter((clan) => clan.id !== id));

        // update database
        this.http.delete(`${this.url}/${id}`).subscribe(() => {
            console.log(`[ClanService] deleted clan with id: ${id}`);
        });
    }

    addPlayerToClan(clanId: string, playerId: string): void {
        // Local update: ensure we store player id strings
        this.clansSignal.update((list) =>
            list.map((clan) => (clan.id === clanId ? { ...clan, players: [...clan.players, playerId] } : clan))
        );

        // Server update: fetch clan by id, append player id, then PUT back
        this.http.get<any>(`${this.url}/${clanId}`).subscribe((clanResource) => {
            if (!clanResource) {
                console.warn(`[ClanService] clan not found on server to add player: ${clanId}`);
                return;
            }
            const updatedClan = { ...clanResource, players: [...(clanResource.players || []), playerId] };
            this.http.put(`${this.url}/${clanId}`, updatedClan).subscribe(() => {
                console.log(`[ClanService] added player to clan on server: ${clanId}`);
            });
        });
    }

    deletePlayerFromClan(clanId: string, playerId: string): void {
        this.clansSignal.update((list) =>
            list.map((clan) =>
                clan.id === clanId ? { ...clan, players: clan.players.filter((p: any) => p.id !== playerId) } : clan
            )
        );

        // Server update: fetch clan by id, remove player id, then PUT back
        this.http.get<any>(`${this.url}/${clanId}`).subscribe((clanResource) => {
            if (!clanResource) {
                console.warn(`[ClanService] clan not found on server to delete player: ${clanId}`);
                return;
            }
            const updatedPlayers = (clanResource.players || []).filter((p: any) =>
                typeof p === 'string' ? p !== playerId : p.id !== playerId
            );
            const updatedClan = { ...clanResource, players: updatedPlayers };
            this.http.put(`${this.url}/${clanId}`, updatedClan).subscribe(() => {
                console.log(`[ClanService] deleted player ${playerId} from clan on server: ${clanId}`);
            });
        });
    }
}
