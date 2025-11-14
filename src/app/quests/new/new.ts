import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestsService } from '../../quests.service';
import { Quest } from '../../modules';

@Component({
    selector: 'app-new',
    imports: [RouterModule, FormsModule],
    templateUrl: './new.html',
    styleUrl: './new.scss',
})
export class New {
    questsService = inject(QuestsService);
    
    id: number = Math.floor(Math.random() * 10000) + 1000;
    title: string = '';
    description: string = '';
    completed: boolean = false;
    xp: number = 0;

    createQuest() {
        const newQuest: Quest = {
            id: this.id,
            title: this.title,
            description: this.description,
            completed: this.completed,
            xp: this.xp
        };
        this.questsService.addQuest(newQuest);
    }
}