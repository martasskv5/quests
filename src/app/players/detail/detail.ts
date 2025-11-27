import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Player, playerLevels, PlayerLevel, Quest } from '../../modules';
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
    playerService: PlayersService = inject(PlayersService);

    player: Player;
    playerLevel: string = '';
    playerNextLevel: number = 0;
    completedQuests: WritableSignal<Quest[]> = signal([]);
    inProgressQuests: WritableSignal<Quest[]> = signal([]);
    constructor() {
        const username = this.route.snapshot.paramMap.get('username');
        this.player = this.playerService.getPlayerByUsername(String(username));
        this.playerLevel = this.playerService.getPlayerLevel(this.player.username).title;
        this.playerNextLevel = this.getNextLevel().xpRequired - this.player.xp;
        this.completedQuests.set(this.player.questsList.filter((quest) => quest.completed));
        this.inProgressQuests.set(this.player.questsList.filter((quest) => !quest.completed));
    }

    completeQuest(id: number) {
        console.log('[player-detail] completeQuest called with id:', id);

        // Immutable update: create new quest objects and replace the list
        const updated = this.player.questsList.map((q) =>
            q.id === id ? { ...q, completed: !q.completed } : q
        );

        this.player.questsList = updated;

        // Refresh the local signals used for rendering the two columns
        this.completedQuests.set(updated.filter((q) => q.completed));
        this.inProgressQuests.set(updated.filter((q) => !q.completed));

        console.log('[player-detail] after update, completed:', this.completedQuests(), 'inProgress:', this.inProgressQuests());
    }

    deleteQuest(id: number) {
        console.log('[player-detail] deleteQuest called with id:', id);
        const updated = this.player.questsList.filter((q) => q.id !== id);
        this.player.questsList = updated;
        this.completedQuests.set(updated.filter((q) => q.completed));
        this.inProgressQuests.set(updated.filter((q) => !q.completed));
        console.log('[player-detail] after delete, completed:', this.completedQuests(), 'inProgress:', this.inProgressQuests());
    }

    getNextLevel(): PlayerLevel {
        const currentLevel = this.playerService.getPlayerLevel(this.player.username);
        const currentLevelIndex = playerLevels.findIndex(
            (level) => level.title === currentLevel.title
        );
        if (currentLevelIndex >= 0 && currentLevelIndex < playerLevels.length - 1) {
            return playerLevels[currentLevelIndex + 1];
        }
        return playerLevels[0];
    }
}
