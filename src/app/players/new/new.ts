import { Component, inject,  } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Player } from '../../modules';
import { PlayersService } from '../../players';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new.html',
  styleUrl: './new.scss'
})
export class New {
    playersService = inject(PlayersService);
    private fb = inject(FormBuilder);

    playerForm = this.fb.group({
        username: ['', [Validators.required]],
        xp: [0, [Validators.required, Validators.min(0)]],
        clan: [''],
        profilePictureUrl: [''],
    });

    createPlayer() {
        if (this.playerForm.invalid) {
            this.playerForm.markAllAsTouched();
            return;
        }

        const fv = this.playerForm.value as { username: string; xp: number; clan: string; profilePictureUrl: string };
        const newPlayer: Player = {
            id: Math.floor(Math.random() * 10000) + 1000,
            username: fv.username,
            xp: fv.xp,
            // clan: fv.clan,
            profilePictureUrl: fv.profilePictureUrl,
            questsList: []
        };

        // Call the service to add the new player
        this.playersService.addPlayer(newPlayer);
    }
}
