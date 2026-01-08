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
import { AuthPage } from './auth/page/page';
import { authGuard } from './auth/auth.guard';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quests', component: Quests, canActivate: [authGuard] },
    { path: 'quests/new', component: NewQuest, canActivate: [authGuard] },
    { path: 'quests/:id', component: Detail, canActivate: [authGuard] },
    { path: "players", component: Players, canActivate: [authGuard] },
    { path: "players/new", component: NewPlayer, canActivate: [authGuard] },
    { path: "players/:username", component: PlayerDetail, canActivate: [authGuard] },
    { path: "clans", component: Clans, canActivate: [authGuard] },
    { path: "clans/new", component: ClanNew, canActivate: [authGuard] },
    { path: "clans/:name", component: ClanDetail, canActivate: [authGuard] },
    { path: "clans/:name/member", component: NewMember, canActivate: [authGuard] },
    { path: "login", component: AuthPage }
];
