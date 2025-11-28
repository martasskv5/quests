import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core';
import { Quest } from '../../modules';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-card',
    imports: [CommonModule],
    templateUrl: './card.html',
    styleUrls: ['./card.scss'],
})
export class Card {
    route: ActivatedRoute = inject(ActivatedRoute);
    status: boolean = true;
    delete: boolean = true;

    ngOnInit() {
        if (this.route.snapshot.url.find(segment => segment.path === 'quests')) {
            this.status = false;
        }
        if (this.route.snapshot.url.find(segment => segment.path === 'players')) {
            this.delete = false;
        }        
    }

    @Input() questData!: Quest;
    quest = computed(() => this.questData);

    @Output() deleteQuest = new EventEmitter<string>();
    @Output() completeQuest = new EventEmitter<string>();

    handleDelete(event: Event) {
        event.stopPropagation();
        if (this.quest().id != null) {
            console.log(this.quest().id);
            
            this.deleteQuest.emit(this.quest().id);
        }
    }

    handleComplete(event: Event) {
        event.stopPropagation();
        if (this.quest().id != null) {
            this.completeQuest.emit(this.quest().id);
        }
    }
}
