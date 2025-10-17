import { Component, computed, inject, Signal, WritableSignal, signal } from '@angular/core';
import { Card } from './card/card';
import { Quest, QuestsService } from '../quests.service';
import { RouterModule } from "@angular/router";


@Component({
    selector: 'app-quests',
    standalone: true,
    imports: [Card, RouterModule],
    templateUrl: './quests.html',
    styleUrls: ['./quests.scss'],
})
export class Quests {
    questsData: WritableSignal<Quest[]> = signal(inject(QuestsService).getQuests());
    quests: Signal<Quest[]> = computed(() => this.questsData());
    questFormVisible = false;
    showQuestForm() {
        // Logic to show the quest creation form
        this.questFormVisible = !this.questFormVisible;
    }
    deleteQuest(id: number) {
        this.questsData.update(quests => quests.filter((quest) => quest.id !== id));
    }

    ngOnInit() {
        console.info("%c Quests component initialized", "color: white; padding: 15px; border: 1px solid green; background-color: green;");
    }
    ngOnDestroy() {
        console.info("%c Quests component destroyed", "color: white; padding: 15px; border: 1px solid red; background-color: red;");
    }
}
