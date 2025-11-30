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

    addPlayerToClan(clanName: string, player: any): void {
        this.clansSignal.update((list) =>
            list.map((clan) => (clan.name === clanName ? { ...clan, players: [...clan.players, player] } : clan))
        );

        // update database
        this.http.post(`${this.url}/${clanName}/players`, player).subscribe(() => {
            console.log(`[ClanService] added player to clan: ${clanName}`);
        });
    }

    deletePlayerFromClan(clanName: string, playerId: string): void {
        this.clansSignal.update((list) =>
            list.map((clan) =>
                clan.name === clanName ? { ...clan, players: clan.players.filter((p: any) => p.id !== playerId) } : clan
            )
        );

        // update database
        this.http.delete(`${this.url}/${clanName}/players/${playerId}`).subscribe(() => {
            console.log(`[ClanService] deleted player from clan: ${clanName}`);
        });
    }
}
