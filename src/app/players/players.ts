import { Component, computed, inject, WritableSignal, signal } from '@angular/core';
import { Player, playerLevels } from '../modules';
import { PlayersService } from '../players';
import { Card } from './card/card';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Search } from '../search/search';

@Component({
    selector: 'app-players',
    imports: [Card, RouterLink, FormsModule, Search],
    templateUrl: './players.html',
    styleUrls: ['./players.scss'],
})
export class Players {
    playersService = inject(PlayersService);
    playersData: WritableSignal<Player[]> = signal(this.playersService.getPlayers());
    playerLevels = playerLevels;
    selectedLevel: WritableSignal<string> = signal('all');

    handleDeletePlayer(username: string) {
        this.playersService.deletePlayerByUsername(username);
        this.playersData.set(this.playersService.getPlayers());
    }

    filteredPlayers = computed(() => {
        const level = this.selectedLevel();
        console.log(level);

        if (level === 'all') {
            return this.playersData();
        }
        return this.playersData().filter(player => this.playersService.getPlayerLevel(player.username).title === level);
    });

    onLevelChange(value: string) {
        this.selectedLevel.set(value);
    }

    onSearchChange(term: string) {
        const allPlayers = this.playersService.getPlayers();
        if (!term) {
            this.playersData.set(allPlayers);
        } else {
            const filteredPlayers = allPlayers.filter(player =>
                player.username.toLowerCase().includes(term.toLowerCase()));
            this.playersData.set(filteredPlayers);
        }
    }
}
