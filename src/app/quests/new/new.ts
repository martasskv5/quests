import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { QuestsService } from '../../quests.service';
import { Quest } from '../../modules';

@Component({
    selector: 'app-new',
    imports: [RouterModule, ReactiveFormsModule],
    templateUrl: './new.html',
    styleUrls: ['./new.scss'],
})
export class New {
    questsService = inject(QuestsService);
    private fb = inject(FormBuilder);

    questForm = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        xp: [0, [Validators.required, Validators.min(0)]],
    });

    createQuest() {
        if (this.questForm.invalid) {
            this.questForm.markAllAsTouched();
            return;
        }

        const fv = this.questForm.value as { title: string; description: string; xp: number };
        const newQuest: Quest = {
            id: Math.floor(Math.random() * 10000) + 1000,
            title: fv.title,
            description: fv.description,
            completed: false,
            xp: Number(fv.xp),
        };

        this.questsService.addQuest(newQuest);
        this.questForm.reset({ xp: 0 });
    }
}