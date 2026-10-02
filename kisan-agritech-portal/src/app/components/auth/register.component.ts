import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-lg mx-auto my-6 p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl">
      <h2 class="text-2xl font-black text-slate-800 text-center mb-6">{{ lang.t('register') }}</h2>
      <form (submit)="onSubmit($event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{{ lang.t('fullName') }}</label>
          <input [(ngModel)]="name" name="name" required placeholder="e.g. Ramesh Patel" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{{ lang.t('phoneNumber') }}</label>
          <input [(ngModel)]="phone" name="phone" required placeholder="10-digit mobile" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{{ lang.t('stateName') }}</label>
            <input [(ngModel)]="state" name="state" placeholder="State/Region" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{{ lang.t('cropType') }}</label>
            <input [(ngModel)]="crop" name="crop" placeholder="Primary Crop" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
          </div>
        </div>
        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all">
          {{ lang.t('submitRegister') }}
        </button>
      </form>
      <div class="mt-4 text-center">
        <a routerLink="/login" class="text-xs text-emerald-700 font-semibold hover:underline">Already have an account? Sign in</a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  phone = '';
  state = 'Odisha';
  crop = 'Rice (Paddy)';

  constructor(public lang: LanguageService, private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.auth.register(this.name, this.phone, this.state, this.crop);
    this.router.navigate(['/dashboard']);
  }
}