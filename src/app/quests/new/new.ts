import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { form, Field, required, submit, min } from '@angular/forms/signals';
import { QuestsService } from '../../quests.service';
import { Quest } from '../../modules';
import {v7 as uuidv7} from 'uuid';

@Component({
    selector: 'app-new',
    imports: [RouterModule, ReactiveFormsModule, Field],
    templateUrl: './new.html',
    styleUrls: ['./new.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New {
    questsService = inject(QuestsService);

    questModel = signal<Quest>({
        id: uuidv7(),
        title: '',
        description: '',
        xp: 1,
        completed: false,
    })

    questForm = form(this.questModel, (fieldPath) => {
        required(fieldPath.title, { message: 'Title is required' });
        required(fieldPath.description, { message: 'Description is required' });
        required(fieldPath.xp, { message: 'XP is required' });
        min(fieldPath.xp, 1, { message: 'XP must be at least 1' });
    });

    createQuest(event: Event) {
        event.preventDefault();
        if (this.questForm().invalid()) {
            this.questForm().markAsTouched();
            return;
        }

        submit(this.questForm, async (form) => {
            console.log('[new-quest] Form submitted with value:', form().value());
            const quest = form().value();
            this.questsService.addQuest(quest);
            this.questForm().reset();
        });
    }
}