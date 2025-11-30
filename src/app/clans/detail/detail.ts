import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Clan, Player } from '../../modules';
import { ClanService } from '../../clans';
import { PlayersService } from '../../players';

@Component({
    selector: 'app-clan-detail',
    imports: [RouterModule],
    templateUrl: './detail.html',
    styleUrl: './detail.scss',
})
export class ClanDetail {
    clanService = inject(ClanService);
    playersService = inject(PlayersService);
    route = inject(ActivatedRoute);
    clan: Clan | null = null;
    clanPlayers: Player[] = [];

    constructor() {
        const clanName = this.route.snapshot.paramMap.get('name');
        if (clanName) {
            this.clan = this.clanService.getClanByName(clanName);
            if (this.clan) {
                this.clanPlayers = this.clan.players
                    .map((playerId) =>
                        this.playersService.getPlayers().find((player) => player.id === playerId)
                    )
                    .filter((player) => player !== undefined) as Player[];
            }
        }
    }

    handleDelete(playerId: string) {
        this.clanService.deletePlayerFromClan(this.clan!.id, playerId);
    }
}
