import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quest } from '../quests';

@Component({
    selector: 'app-card',
    imports: [CommonModule],
    templateUrl: './card.html',
    styleUrls: ['./card.scss'],
})
export class Card {
    questData = input.required<Quest>();
    quest = computed(() => this.questData());

    deleteQuest = output<number>();
}
