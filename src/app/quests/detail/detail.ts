import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Quest, QuestsService } from '../../quests.service';

@Component({
  selector: 'app-detail',
  imports: [RouterModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail {
    route: ActivatedRoute = inject(ActivatedRoute);
    quest: Quest;
    constructor() {
        const questId = this.route.snapshot.paramMap.get('id');
        const questsService = inject(QuestsService);
        this.quest = questsService.getQuestById(Number(questId));
        console.log('Quest detail for ID:', questId, this.quest);
    }
}
