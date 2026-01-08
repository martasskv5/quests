import { Component, inject, signal } from '@angular/core';
import { form, Field, required, submit } from '@angular/forms/signals';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface LoginModel {
    email: string;
    password: string;
}

@Component({
  selector: 'app-page',
  imports: [Field],
  templateUrl: './page.html',
  styleUrl: './page.scss',
})
export class AuthPage {
    authService = inject(AuthService);
    router = inject(Router);

    loginModel = signal<LoginModel>({
        email: '',
        password: '',
    });

    loginForm = form(this.loginModel, (fieldPath) => {
        required(fieldPath.email, { message: 'Email is required' });
        required(fieldPath.password, { message: 'Password is required' });
    });

    login(event: Event) {
        event.preventDefault();
        if (this.loginForm().invalid()) {
            this.loginForm().markAsTouched();
            return;
        }
        submit(this.loginForm, async (form) => {
            console.log('[login] Form submitted with value:', form().value());
            const credentials = form().value();
            this.authService.login(credentials).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    // Get the return URL from query params or default to home
                    const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl(returnUrl as string);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                },
            });
        });
    }

}
