import { Component, computed, inject, Signal, WritableSignal, signal, Input } from '@angular/core';
import { Card } from './card/card';
import { QuestsService } from '../quests.service';
import { Quest } from '../modules';
import { RouterModule } from "@angular/router";
import { Search } from '../search/search';


@Component({
    selector: 'app-quests',
    standalone: true,
    imports: [Card, RouterModule, Search],
    templateUrl: './quests.html',
    styleUrls: ['./quests.scss'],
})
export class Quests {
    questsService = inject(QuestsService);
    @Input() questsData: Signal<Quest[]> = signal(this.questsService.getQuests());


    // Use a writable local signal so we can call update() on it
    quests: WritableSignal<Quest[]> = signal([]);
    questFormVisible = false;
    showQuestForm() {
        // Logic to show the quest creation form
        this.questFormVisible = !this.questFormVisible;
    }
    deleteQuest(id: number) {
        this.quests.update(quests => quests.filter((quest) => quest.id !== id));
    }
    completeQuest(id: number) {
        this.quests.update(quests => quests.map((quest) => {
            if (quest.id === id) {
                quest.completed = true;
            }
            return quest;
        }));
    }
    onSearchChange(term: string) {
        const allQuests = this.questsService.getQuests();
        if (!term) {
            this.quests.set(allQuests);
        } else {
            const filteredQuests = allQuests.filter(quest =>
                quest.title.toLowerCase().includes(term.toLowerCase()) ||
                quest.description.toLowerCase().includes(term.toLowerCase())
            );
            this.quests.set(filteredQuests);
        }
    }

    ngOnInit() {
        // Initialize the writable signal from the input signal value
        this.quests.set(this.questsData());
        console.info("%c Quests component initialized", "color: white; padding: 15px; border: 1px solid green; background-color: green;");
    }
    ngOnDestroy() {
        console.info("%c Quests component destroyed", "color: white; padding: 15px; border: 1px solid red; background-color: red;");
    }
}
