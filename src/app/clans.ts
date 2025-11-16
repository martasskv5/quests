import { Injectable } from '@angular/core';
import { Clan } from './modules';

@Injectable({
    providedIn: 'root',
})
export class ClanService {
    // avoid injecting PlayersService here to prevent a circular dependency
    // initial data should not reference PlayersService directly
    private clans: Clan[] = [
        {
            name: 'Warriors',
            description: 'A clan of brave warriors.',
            capacity: 8,
            profilePictureUrl: undefined,
            players: [
                {
                    id: 1,
                    username: 'Hero123',
                    xp: 200,
                    profilePictureUrl: undefined,
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
            ],
        },
    ];

    addClan(clan: Clan): void {
        this.clans.push(clan);
    }

    getClans(): Clan[] {
        return this.clans;
    }

    getClanByName(name: string): Clan {
        return this.clans.find((clan) => clan.name === name) as Clan;
    }

    deleteClanByName(name: string): void {
        this.clans = this.clans.filter((clan) => clan.name !== name);
    }

    addPlayerToClan(clanName: string, player: any): void {
        const clan = this.getClanByName(clanName);
        if (clan) {
            clan.players.push(player);
        }
    }

    deletePlayerFromClan(clanName: string, playerName: string): void {
        const clan = this.getClanByName(clanName);
        if (clan) {
            clan.players = clan.players.filter((player) => player.username !== playerName);
        }
    }
}
