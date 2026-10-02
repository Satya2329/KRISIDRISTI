import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto h-[75vh] flex flex-col bg-white border border-emerald-100 rounded-3xl shadow-xl overflow-hidden">
      <div class="p-4 bg-gradient-to-r from-emerald-800 to-green-700 text-white font-bold flex justify-between items-center">
        <span>🌱 {{ lang.t('aiChatTitle') }}</span>
        <span class="text-xs bg-emerald-600/60 px-2.5 py-1 rounded-full border border-emerald-400/30">Agronomist AI Online</span>
      </div>

      <div class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        @for (msg of messages(); track msg.id) {
          <div [class]="msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div [class]="msg.sender === 'user' ? 'bg-emerald-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-md text-sm' : 'bg-white border border-emerald-200 text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-xs max-w-md text-sm'">
              {{ msg.text }}
            </div>
          </div>
        }
      </div>

      <form (submit)="send($event)" class="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input [(ngModel)]="input" name="text" placeholder="Ask anything about crops, seeds, pests, or mandi..." class="flex-1 px-4 py-2.5 border rounded-2xl outline-none text-sm focus:border-emerald-500" />
        <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm cursor-pointer shadow-md">Send</button>
      </form>
    </div>
  `
})
export class AiChatComponent {
  input = '';
  messages = signal<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Namaste Kisan Bandhu! Ask me about weather, soil nutrients, pests, fertilizers, or mandi prices.', time: '10:00 AM' }
  ]);

  constructor(public lang: LanguageService) {}

  send(e: Event) {
    e.preventDefault();
    if (!this.input.trim()) return;
    const txt = this.input;
    this.messages.update(m => [...m, { id: Date.now().toString(), sender: 'user', text: txt, time: 'Now' }]);
    this.input = '';
    setTimeout(() => {
      this.messages.update(m => [...m, { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: 'Advisory: Use balanced NPK ratio and inspect the crop underside for aphid colonies. Apply neem oil spray if needed.', 
        time: 'Now' 
      }]);
    }, 500);
  }
}