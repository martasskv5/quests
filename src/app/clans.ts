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
    }

    getClans(): Clan[] {
        return this.clansSignal();
    }

    getClanByName(name: string): Clan {
        return this.clansSignal().find((clan) => clan.name === name) as Clan;
    }

    deleteClanByName(name: string): void {
        this.clansSignal.update((list) => list.filter((clan) => clan.name !== name));
    }

    addPlayerToClan(clanName: string, player: any): void {
        this.clansSignal.update((list) =>
            list.map((clan) => (clan.name === clanName ? { ...clan, players: [...clan.players, player] } : clan))
        );
    }

    deletePlayerFromClan(clanName: string, playerId: string): void {
        this.clansSignal.update((list) =>
            list.map((clan) =>
                clan.name === clanName ? { ...clan, players: clan.players.filter((p: any) => p.id !== playerId) } : clan
            )
        );
    }
}
