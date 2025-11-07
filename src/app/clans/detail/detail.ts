import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Clan } from '../../modules';
import { ClanService } from '../../clans';

@Component({
  selector: 'app-clan-detail',
  imports: [RouterModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class ClanDetail {
  clanService = inject(ClanService);
  route = inject(ActivatedRoute);
  clan: Clan | null = null;

  constructor() {
    const clanName = this.route.snapshot.paramMap.get('name');
    if (clanName) {
      this.clan = this.clanService.getClanByName(clanName);
    }
  }

  handleDelete(playerName: string) {
    this.clanService.deletePlayerFromClan(this.clan!.name, playerName);
  }
}
