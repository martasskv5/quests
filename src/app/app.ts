import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule],
    standalone: true,
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
})
export class App {
    protected readonly title = signal('quests');
    header = 'Quest Overflow';
    header_logo = 'meteor-original.svg';

    authService = inject(AuthService);

    protected readonly isAuthenticated = signal(false);
    currentUser$ = this.authService.currentUser$;

    constructor() {
        this.authService.currentUser$.subscribe((user) => {
            this.isAuthenticated.set(!!user);
        });
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.isAuthenticated.set(false);
                console.log('User logged out successfully');
            },
            error: (error) => {
                console.error('Logout failed:', error);
            },
        });
    }

    // visible = true

    // toggle() {
    //     this.visible = !this.visible
    // }
}
