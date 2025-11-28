import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { form, Field, required, submit } from '@angular/forms/signals';
import { Player } from '../../modules';
import { PlayersService } from '../../players';
import { RouterLink } from '@angular/router';
import { v7 as uuidv7 } from 'uuid';

@Component({
    selector: 'app-new',
    imports: [ReactiveFormsModule, RouterLink, Field],
    templateUrl: './new.html',
    styleUrl: './new.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New {
    playersService = inject(PlayersService);

    playerModel = signal<Player>({
        id: uuidv7(),
        username: '',
        xp: 0,
        profilePictureUrl: '',
        questsList: [],
    });

    playerForm = form(this.playerModel, (fieldPath) => {
        required(fieldPath.username, { message: 'Username is required' });
    });

    createPlayer(event: Event) {
        event.preventDefault();
        if (this.playerForm().invalid()) {
            this.playerForm().markAsTouched();
            return;
        }

        submit(this.playerForm, async (form) => {
            console.log('[new-player] Form submitted with value:', form().value());
            const newPlayer = form().value();
            this.playersService.addPlayer(newPlayer);
            this.playerForm().reset();
        });
    }
}
