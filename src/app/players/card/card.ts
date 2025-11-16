import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { Player } from '../../modules';
import { Card as QuestsCard } from '../../quests/card/card';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../players';

@Component({
  selector: 'app-player-card',
  imports: [RouterModule],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {
    @Input() playerData!: Player;
    player = computed(() => this.playerData);
    playerService: PlayersService = inject(PlayersService);
    @Output() deletePlayer = new EventEmitter<string>();

    handleDelete(event: Event) {
        event.stopPropagation();
        if (this.playerData.id != null) {
            console.log(this.playerData.username);

            this.deletePlayer.emit(this.playerData.username);
        }
    }
}
