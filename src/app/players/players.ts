import { Component, computed, inject, Signal, WritableSignal, signal } from '@angular/core';
import { Player } from '../modules';
import { PlayersService } from '../players';
import { Card } from './card/card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-players',
  imports: [Card, RouterLink],
  templateUrl: './players.html',
  styleUrl: './players.scss'
})
export class Players {
    playersData: WritableSignal<Player[]> = signal(inject(PlayersService).getPlayers());
}
