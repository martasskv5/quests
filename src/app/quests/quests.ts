import { Component, inject } from '@angular/core';
import { Card } from './card/card';
import { Quest, QuestsService } from '../quests.service';


@Component({
    selector: 'app-quests',
    standalone: true,
    imports: [Card],
    templateUrl: './quests.html',
    styleUrls: ['./quests.scss'],
})
export class Quests {
    quests: Quest[] = inject(QuestsService).getQuests();
    questFormVisible = false;
    showQuestForm() {
        // Logic to show the quest creation form
        this.questFormVisible = !this.questFormVisible;
    }
    deleteQuest(id: number) {
        this.quests = this.quests.filter((quest) => quest.id !== id);
    }

    ngOnInit() {
        console.info("%c Quests component initialized", "color: white; padding: 15px; border: 1px solid green; background-color: green;");
    }
    ngOnDestroy() {
        console.info("%c Quests component destroyed", "color: white; padding: 15px; border: 1px solid red; background-color: red;");
    }
}
