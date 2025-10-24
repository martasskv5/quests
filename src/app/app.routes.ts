import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Quests } from './quests/quests';
import { Detail } from './quests/detail/detail';
import { Players } from './players/players';
import { New as NewPlayer } from './players/new/new';
import { Detail as PlayerDetail } from './players/detail/detail';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quests', component: Quests },
    { path: 'quests/:id', component: Detail },
    { path: "players", component: Players },
    { path: "players/new", component: NewPlayer },
    { path: "players/:username", component: PlayerDetail },
];
