import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Player } from '../../modules';
import { PlayersService } from '../../players';
import { Card as QuestsCard } from '../../quests/card/card';

@Component({
    selector: 'app-player-detail',
    imports: [RouterModule, QuestsCard],
    templateUrl: './detail.html',
    styleUrl: './detail.scss',
})
export class Detail {
    route: ActivatedRoute = inject(ActivatedRoute);
    player: Player;
    constructor() {
        const username = this.route.snapshot.paramMap.get('username');
        const playersService = inject(PlayersService);
        this.player = playersService.getPlayerByUsername(String(username));
    }

    completeQuest(id: number) {
        this.player.questsList = this.player.questsList.map((quest) => {
            if (quest.id === id) {
                quest.completed = true;
            }
            return quest;
        });
    }

    deleteQuest(id: number) {
        this.player.questsList = this.player.questsList.filter((quest) => quest.id !== id);
    }
}
