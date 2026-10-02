import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="p-8 bg-gradient-to-r from-emerald-800 to-green-600 text-white rounded-3xl shadow-xl">
        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">🌾 {{ auth.currentUser()?.state }} • {{ auth.currentUser()?.primaryCrop }}</span>
        <h1 class="text-3xl font-black mt-3">{{ lang.t('welcome') }}, {{ auth.currentUser()?.name }}!</h1>
        <p class="text-emerald-100 text-sm mt-1">Smart agricultural hub for crop health, live prices, and instant field advisory.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div class="text-xs text-slate-500 font-semibold">Weather</div>
          <div class="text-sm font-bold text-slate-800">31°C • Sunny</div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div class="text-xs text-slate-500 font-semibold">Soil Moisture</div>
          <div class="text-sm font-bold text-slate-800">Optimal (68%)</div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div class="text-xs text-slate-500 font-semibold">Mandi Paddy</div>
          <div class="text-sm font-bold text-emerald-700">₹2,320 / Qtl</div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div class="text-xs text-slate-500 font-semibold">Fertilizer Dose</div>
          <div class="text-sm font-bold text-slate-800">NPK 4:2:1 (Zinc)</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div routerLink="/chat" class="p-6 bg-white border border-emerald-100 rounded-3xl shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between">
          <div>
            <div class="text-3xl mb-3">💬</div>
            <h3 class="text-lg font-bold text-slate-800">{{ lang.t('aiChatTitle') }}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ lang.t('aiChatDesc') }}</p>
          </div>
          <div class="mt-4 pt-3 border-t text-emerald-700 font-semibold text-xs flex justify-between items-center">
            <span>{{ lang.t('openService') }}</span>
            <span>→</span>
          </div>
        </div>

        <div routerLink="/disease" class="p-6 bg-white border border-emerald-100 rounded-3xl shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between">
          <div>
            <div class="text-3xl mb-3">📸</div>
            <h3 class="text-lg font-bold text-slate-800">{{ lang.t('imageUploadTitle') }}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ lang.t('imageUploadDesc') }}</p>
          </div>
          <div class="mt-4 pt-3 border-t text-emerald-700 font-semibold text-xs flex justify-between items-center">
            <span>{{ lang.t('openService') }}</span>
            <span>→</span>
          </div>
        </div>

        <div routerLink="/voice" class="p-6 bg-white border border-emerald-100 rounded-3xl shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between">
          <div>
            <div class="text-3xl mb-3">🎙️</div>
            <h3 class="text-lg font-bold text-slate-800">{{ lang.t('voiceTitle') }}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ lang.t('voiceDesc') }}</p>
          </div>
          <div class="mt-4 pt-3 border-t text-emerald-700 font-semibold text-xs flex justify-between items-center">
            <span>{{ lang.t('openService') }}</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  constructor(public auth: AuthService, public lang: LanguageService) {}
}