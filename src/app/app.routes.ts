import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Quests } from './quests/quests';
import { Detail } from './quests/detail/detail';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quests', component: Quests },
    { path: 'quests/:id', component: Detail }
];
