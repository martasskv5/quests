import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { Clan } from '../../modules';
import { Card as QuestsCard } from '../../quests/card/card';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-clans-card',
    imports: [RouterModule],
    templateUrl: './card.html',
    styleUrl: './card.scss',
})
export class ClanCard {
    @Input() clanData!: Clan;
    clan = computed(() => this.clanData);
    @Output() deleteClan = new EventEmitter<string>();

    handleDelete(event: Event) {
        event.stopPropagation();
        if (this.clanData != null) {
            console.log(this.clanData.name);
            this.deleteClan.emit(this.clanData.name);
        }
    }
}
