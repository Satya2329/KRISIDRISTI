import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceService } from '../../services/voice.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-voice-assistant',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-xl mx-auto p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl text-center space-y-6">
      <h2 class="text-2xl font-black text-slate-800">{{ lang.t('voiceTitle') }}</h2>
      <p class="text-xs text-slate-500">{{ lang.t('voiceDesc') }}</p>

      <button (click)="voice.toggleListening()" [class]="voice.isListening() ? 'bg-red-500 scale-110 shadow-red-500/30' : 'bg-gradient-to-tr from-emerald-600 to-green-500 shadow-emerald-700/30'" class="w-24 h-24 rounded-full text-white text-3xl shadow-xl mx-auto transition-all cursor-pointer flex items-center justify-center">
        🎙️
      </button>

      <div class="p-4 bg-slate-50 border rounded-2xl text-left text-xs">
        <div class="font-bold text-slate-400 uppercase tracking-wider">Recognized Transcript</div>
        <div class="text-sm font-semibold text-slate-800 mt-1">{{ voice.transcript() || 'Press mic and speak...' }}</div>
      </div>

      @if (voice.botVoiceReply()) {
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left text-xs text-emerald-950">
          <strong>Voice Response:</strong> {{ voice.botVoiceReply() }}
        </div>
      }

      <div class="pt-3 border-t flex flex-wrap justify-center gap-2">
        <button (click)="voice.simulate('go to dashboard')" class="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer">
          "Go to dashboard"
        </button>
        <button (click)="voice.simulate('open chat')" class="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer">
          "Open chat"
        </button>
        <button (click)="voice.simulate('check crop disease')" class="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer">
          "Check crop disease"
        </button>
      </div>
    </div>
  `
})
export class VoiceAssistantComponent {
  constructor(public voice: VoiceService, public lang: LanguageService) {}
}