import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Clan } from '../../modules';
import { ClanService } from '../../clans';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-clan-new',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './new.html',
    styleUrl: './new.scss',
})
export class ClanNew {
    clanService = inject(ClanService);
    private fb = inject(FormBuilder);

    clanForm = this.fb.group({
        name: ['', [Validators.required]],
        description: [''],
        capacity: [10, [Validators.required, Validators.min(1)]],
        profilePictureUrl: [''],
        players: [[]],
    });

    createClan() {
        if (this.clanForm.invalid) {
            this.clanForm.markAllAsTouched();
            return;
        }

        const fv = this.clanForm.value as { name: string; description: string; capacity: number;};
        const newClan: Clan = {
            name: fv.name,
            description: fv.description,
            capacity: fv.capacity,
            profilePictureUrl: '',
            players: [],
        };
        // Call the service to add the new clan
        this.clanService.addClan(newClan);
    }
}
