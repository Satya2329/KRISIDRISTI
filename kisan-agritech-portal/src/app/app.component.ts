import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-emerald-50/30 flex flex-col font-sans selection:bg-emerald-200">
      <header class="bg-white border-b border-emerald-100 p-4 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a routerLink="/dashboard" class="flex items-center gap-2 cursor-pointer">
            <span class="w-10 h-10 bg-gradient-to-tr from-emerald-700 to-green-600 text-white rounded-2xl flex items-center justify-center font-black">🌾</span>
            <span class="font-black text-xl text-emerald-950">{{ lang.t('appName') }}</span>
          </a>

          <div class="flex items-center gap-3">
            <select [ngModel]="lang.currentLang()" (ngModelChange)="lang.setLanguage($event)" class="text-xs bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 font-bold text-emerald-950 outline-none cursor-pointer">
              @for (item of lang.languages; track item.code) {
                <option [value]="item.code">{{ item.label }} ({{ item.state }})</option>
              }
            </select>

            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" class="text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-50">{{ lang.t('dashboard') }}</a>
              <button (click)="auth.logout()" class="text-xs text-red-600 font-bold px-2 py-1 cursor-pointer hover:underline">{{ lang.t('logout') }}</button>
            } @else {
              <a routerLink="/login" class="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl">{{ lang.t('login') }}</a>
            }
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  constructor(public lang: LanguageService, public auth: AuthService) {}
}