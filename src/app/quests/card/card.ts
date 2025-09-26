import { Component, computed, input, output } from '@angular/core';
import { Quest } from '../quests';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  questData = input.required<Quest>();
  quest = computed(() => this.questData());

  deleteQuest = output<number>();
}
