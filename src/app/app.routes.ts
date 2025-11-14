import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Quests } from './quests/quests';
import { New as NewQuest } from './quests/new/new';
import { Detail } from './quests/detail/detail';
import { Players } from './players/players';
import { New as NewPlayer } from './players/new/new';
import { Detail as PlayerDetail } from './players/detail/detail';
import { Clans } from './clans/clans';
import { ClanDetail } from './clans/detail/detail';
import { ClanNew } from './clans/new/new';
import { NewMember } from './clans/new/member/member';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quests', component: Quests },
    { path: 'quests/new', component: NewQuest },
    { path: 'quests/:id', component: Detail },
    { path: "players", component: Players },
    { path: "players/new", component: NewPlayer },
    { path: "players/:username", component: PlayerDetail },
    { path: "clans", component: Clans },
    { path: "clans/new", component: ClanNew },
    { path: "clans/:name", component: ClanDetail },
    { path: "clans/:name/member", component: NewMember },
];
