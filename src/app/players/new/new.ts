import { Component, inject,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '../../modules';
import { PlayersService } from '../../players';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new',
  imports: [FormsModule, RouterLink],
  templateUrl: './new.html',
  styleUrl: './new.scss'
})
export class New {
    playersService = inject(PlayersService);

    playerId: number = Math.floor(Math.random() * 10000) + 1000;
    username: string = '';
    xp: number = 0;
    clan: string = '';
    profilePictureUrl: string = '';
    questsList: any[] = [];

    createPlayer() {
        const newPlayer: Player = {
            id: this.playerId,
            username: this.username,
            xp: this.xp,
            // clan: this.clan,
            profilePictureUrl: this.profilePictureUrl,
            questsList: this.questsList
        };

        // Call the service to add the new player
        this.playersService.addPlayer(newPlayer);
    }
}
