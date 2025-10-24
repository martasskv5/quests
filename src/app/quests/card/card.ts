import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core';
import { Quest } from '../../modules';

@Component({
    selector: 'app-card',
    imports: [CommonModule],
    templateUrl: './card.html',
    styleUrls: ['./card.scss'],
})
export class Card {
    @Input() questData!: Quest;
    quest = computed(() => this.questData);

    @Output() deleteQuest = new EventEmitter<number>();
    @Output() completeQuest = new EventEmitter<number>();

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
