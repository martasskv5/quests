import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
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

    // Random ID for the new member
    id: number = Math.floor(Math.random() * 100000);
    username: string = '';
    level: number = 1;
    profilePictureUrl: string = '';
    playerClan: Clan = this.clan!;

    addMember() {
        const newMember: Player = {
            id: this.id,
            username: this.username,
            level: this.level,
            profilePictureUrl: this.profilePictureUrl,
            clan: this.playerClan,
            questsList: []
        };

        // Call the service to add the new player
        this.clanService.addPlayerToClan(this.clan!.name, newMember);
    }
}
