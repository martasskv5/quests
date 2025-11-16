import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { Player, playerLevels, PlayerLevel } from '../../modules';
import { PlayersService } from '../../players';
import { Card as QuestsCard } from '../../quests/card/card';

@Component({
    selector: 'app-player-detail',
    imports: [RouterModule, QuestsCard, NgClass],
    templateUrl: './detail.html',
    styleUrl: './detail.scss',
})
export class Detail {
    route: ActivatedRoute = inject(ActivatedRoute);
    player: Player;
    playerService: PlayersService = inject(PlayersService);
    constructor() {
        const username = this.route.snapshot.paramMap.get('username');
        this.player = this.playerService.getPlayerByUsername(String(username));
    }

    completeQuest(id: number) {
        this.player.questsList = this.player.questsList.map((quest) => {
            if (quest.id === id) {
                // quest.completed = true;
                quest.completed = !quest.completed;
            }
            return quest;
        });
    }

    deleteQuest(id: number) {
        this.player.questsList = this.player.questsList.filter((quest) => quest.id !== id);
    }

    getNextLevel(): PlayerLevel {
        const currentLevel = this.playerService.getPlayerLevel(this.player.username);
        const currentLevelIndex = playerLevels.findIndex(level => level.title === currentLevel.title);
        if (currentLevelIndex >= 0 && currentLevelIndex < playerLevels.length - 1) {
            return playerLevels[currentLevelIndex + 1];
        }
        return playerLevels[0];
    }
}