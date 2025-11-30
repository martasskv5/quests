import { Component, Input, Output, EventEmitter, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Clan, Player } from '../../../modules';
import { ClanService } from '../../../clans';
import { PlayersService } from '../../../players';

@Component({
    selector: 'app-clan-new-member',
    imports: [FormsModule],
    templateUrl: './member.html',
    styleUrl: './member.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMember {
    @Output() memberAdded = new EventEmitter<any>();

    playerService = inject(PlayersService);
    clanService = inject(ClanService);

    route = inject(ActivatedRoute);
    clan: Clan | null = null;

    constructor() {
        const clanName = this.route.snapshot.paramMap.get('name');
        if (clanName) {
            this.clan = this.clanService.getClanByName(clanName);
        }
    }

    avaiblePlayers: Player[] = this.playerService.getPlayers();

    username: string = '';

    addMember() {
        const newMember: Player = this.playerService.getPlayerByUsername(this.username);
        if (!newMember) {
            console.error('Player not found');
            return;
        }
        if (this.clan!.players.length >= this.clan!.capacity) {
            alert('Clan is at full capacity!');
            return;
        }
        if (newMember.clan) {
            alert('Player is already in a clan!');
            return;
        }

        // Call the service to add the new player
        this.clanService.addPlayerToClan(this.clan!.id, newMember.id);
    }
}
