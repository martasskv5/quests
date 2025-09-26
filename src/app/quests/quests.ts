import { Component } from '@angular/core';
import { Card } from './card/card';

export type Quest = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
};

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [Card],
  templateUrl: './quests.html',
  styleUrls: ['./quests.scss'],
})
export class Quests {
  quests: Quest[] = [
    {
      id: 1,
      title: 'Find the Lost Sword',
      description: 'Retrieve the legendary sword from the ancient ruins.',
      completed: false,
      xp: 100,
    },
    {
      id: 2,
      title: 'Rescue the Villagers',
      description: 'Save the villagers captured by goblins.',
      completed: true,
      xp: 200,
    },
    {
      id: 3,
      title: 'Collect Herbs',
      description: 'Gather 10 healing herbs for the village healer.',
      completed: false,
      xp: 50,
    },
  ];
  questFormVisible = false;
  showQuestForm() {
    // Logic to show the quest creation form
    this.questFormVisible = !this.questFormVisible;
  }
  deleteQuest(id: number) {
    this.quests = this.quests.filter((quest) => quest.id !== id);
  }
}
