import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Player, playerLevels, PlayerLevel, Quest } from '../../modules';
import { PlayersService } from '../../players';
import { QuestsService } from '../../quests.service';
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
    questsService: QuestsService = inject(QuestsService);

    player: Player;
    playerLevel: string = '';
    playerNextLevel: number = 0;
    playerQuests: WritableSignal<Quest[]> = signal([]);
    completedQuests: WritableSignal<Quest[]> = signal([]);
    inProgressQuests: WritableSignal<Quest[]> = signal([]);
    constructor() {
        const username = this.route.snapshot.paramMap.get('username');
        this.player = this.playerService.getPlayerByUsername(String(username));
        this.playerLevel = this.playerService.getPlayerLevel(this.player.username).title;
        this.playerNextLevel = this.getNextLevel().xpRequired - this.player.xp;

        // Load quests for the player
        const allQuests = this.questsService.getQuests();
        // Keep only quests that are assigned to the player (produces Quest[])
        const playerQuests = allQuests.filter((quest) =>
            this.player.questsList.some((q) => q.id === quest.id)
        );

        // update quests status based on player's questsList
        playerQuests.forEach((quest) => {
            const playerQuest = this.player.questsList.find((q) => q.id === quest.id);
            if (playerQuest) {
                quest.completed = playerQuest.completed;
            }
        });

        // set the signal and derived lists
        this.playerQuests.set(playerQuests);
        console.log(this.playerQuests());

        this.completedQuests.set(
            playerQuests.filter((q) => q.completed)
        );
        this.inProgressQuests.set(
            playerQuests.filter((q) => !q.completed)
        );
    }

    completeQuest(id: string) {
        console.log('[player-detail] completeQuest called with id:', id);

        // Immutable update: create new quest objects and replace the list
        const updated = this.playerQuests().map((q) =>
            q.id === id ? { ...q, completed: !q.completed } : q
        );

        this.playerQuests.set(updated);

        // Refresh the local signals used for rendering the two columns
        this.completedQuests.set(updated.filter((q) => q.completed));
        this.inProgressQuests.set(updated.filter((q) => !q.completed));

        console.log(
            '[player-detail] after update, completed:',
            this.completedQuests(),
            'inProgress:',
            this.inProgressQuests()
        );

        // update player XP based on quest completion
        const quest = updated.find((q) => q.id === id);
        if (quest) {
            if (quest.completed) {
                this.player.xp += quest.xp;
            } else {
                this.player.xp -= quest.xp;
            }
            this.playerLevel = this.playerService.getPlayerLevel(this.player.username).title;
            this.playerNextLevel = this.getNextLevel().xpRequired - this.player.xp;
        }
    }

    deleteQuest(id: string) {
        console.log('[player-detail] deleteQuest called with id:', id);
        const updated = this.player.questsList.filter((q) => q.id !== id);
        this.player.questsList = updated;
        this.completedQuests.set(updated.filter((q) => q.completed));
        this.inProgressQuests.set(updated.filter((q) => !q.completed));
        console.log(
            '[player-detail] after delete, completed:',
            this.completedQuests(),
            'inProgress:',
            this.inProgressQuests()
        );
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
