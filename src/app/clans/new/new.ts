import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Clan } from '../../modules';
import { ClanService } from '../../clans';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-clan-new',
    imports: [FormsModule, RouterLink],
    templateUrl: './new.html',
    styleUrl: './new.scss',
})
export class ClanNew {
    clanService = inject(ClanService);

    name: string = '';
    description: string = '';
    capacity: number = 10;
    profilePictureUrl: string = '';
    players: any[] = [];

    createClan() {
        const newClan: Clan = {
            name: this.name,
            description: this.description,
            capacity: this.capacity,
            profilePictureUrl: this.profilePictureUrl,
            players: this.players,
        };
        // Call the service to add the new clan
        this.clanService.addClan(newClan);
    }
}
