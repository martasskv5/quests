import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ClanService } from '../clans';
import { Clan } from '../modules';
import { ClanCard } from './card/card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-clans',
  imports: [ClanCard, RouterLink],
  templateUrl: './clans.html',
  styleUrl: './clans.scss'
})
export class Clans {
    clanService = inject(ClanService);
    clansData: WritableSignal<Clan[]> = signal(this.clanService.getClans());

    handleDeleteClan(name: string) {
        this.clanService.deleteClanByName(name);
        this.clansData.set(this.clanService.getClans());
    }
}
