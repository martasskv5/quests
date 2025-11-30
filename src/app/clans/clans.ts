import { Component, inject, signal, WritableSignal, computed, effect } from '@angular/core';
import { ClanService } from '../clans';
import { Clan } from '../modules';
import { ClanCard } from './card/card';
import { RouterLink } from "@angular/router";
import { Search } from '../search/search';

@Component({
  selector: 'app-clans',
  imports: [ClanCard, RouterLink, Search],
  templateUrl: './clans.html',
  styleUrl: './clans.scss'
})
export class Clans {
    clanService = inject(ClanService);
    private allClans = computed(() => this.clanService.getClans());
    clansData: WritableSignal<Clan[]> = signal(this.allClans());

    constructor() {
        // keep local signal in sync with the service signal
        effect(() => {
            this.clansData.set(this.allClans());
        });
    }

    handleDeleteClan(id: string) {
        this.clanService.deleteClanById(id);
        this.clansData.set(this.clanService.getClans());
    }

    onSearchChange(term: string) {
        const allClans = this.clanService.getClans();
        if (!term) {
            this.clansData.set(allClans);
        } else {
            const filteredClans = allClans.filter(clan =>
                clan.name.toLowerCase().includes(term.toLowerCase()));
            this.clansData.set(filteredClans);
        }
    }
}
