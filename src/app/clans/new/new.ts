import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Clan } from '../../modules';
import { ClanService } from '../../clans';
import { RouterLink } from '@angular/router';
import { form, Field, required, submit, min } from '@angular/forms/signals';
import { v7 as uuidv7} from 'uuid';

@Component({
    selector: 'app-clan-new',
    imports: [ReactiveFormsModule, RouterLink, Field],
    templateUrl: './new.html',
    styleUrl: './new.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClanNew {
    clanService = inject(ClanService);

    clanModel = signal<Clan>({
        id: uuidv7(),
        name: '',
        description: '',
        capacity: 10,
        profilePictureUrl: '',
        players: [],
    });

    clanForm = form(this.clanModel, (fieldPath) => {
        required(fieldPath.name, { message: 'Clan name is required' });
        required(fieldPath.description, { message: 'Description is required' });
        required(fieldPath.capacity, { message: 'Capacity is required' });
        min(fieldPath.capacity, 1, { message: 'Capacity must be at least 1' });
    });

    createClan(event: Event) {
        event.preventDefault();
        if (this.clanForm().invalid()) {
            this.clanForm().markAsTouched();
            return;
        }

        submit(this.clanForm, async (form) => {
            console.log('[new-clan] Form submitted with value:', form().value());
            const clan = form().value();
            this.clanService.addClan(clan);
            this.clanForm().reset();
        });
    }
}
