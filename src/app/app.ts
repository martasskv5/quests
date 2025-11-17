import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Search } from './search/search';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule, Search],
    standalone: true,
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
})
export class App {
    protected readonly title = signal('quests');
    header = 'Quest Overflow';
    header_logo = 'meteor-original.svg';

    // visible = true

    // toggle() {
    //     this.visible = !this.visible
    // }
}
