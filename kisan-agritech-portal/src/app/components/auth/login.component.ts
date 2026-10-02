import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto my-8 p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">🌾</div>
        <h2 class="text-2xl font-black text-slate-800">{{ lang.t('login') }}</h2>
        <p class="text-xs text-slate-500 mt-1">{{ lang.t('tagline') }}</p>
      </div>

      <form (submit)="onSubmit($event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{{ lang.t('phoneNumber') }}</label>
          <input [(ngModel)]="phone" name="phone" required placeholder="9876543210" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{{ lang.t('password') }}</label>
          <input type="password" [(ngModel)]="pass" name="password" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
        </div>
        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all">
          {{ lang.t('submitLogin') }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <a routerLink="/register" class="text-xs text-emerald-700 font-semibold hover:underline">
          Don't have an account? Register here
        </a>
      </div>
    </div>
  `
})
export class LoginComponent {
  phone = '9876543210';
  pass = 'kisan123';

  constructor(public lang: LanguageService, private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.auth.login(this.phone);
    this.router.navigate(['/dashboard']);
  }
}