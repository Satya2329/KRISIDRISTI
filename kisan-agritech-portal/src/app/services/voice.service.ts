import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  isListening = signal<boolean>(false);
  transcript = signal<string>('');
  botVoiceReply = signal<string>('');
  private recognition: any = null;

  constructor(private router: Router) {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        this.transcript.set(text);
        this.handleVoiceNavigation(text);
        this.isListening.set(false);
      };
      

      this.recognition.onerror = () => this.isListening.set(false);
      this.recognition.onend = () => this.isListening.set(false);
    }
  }

  toggleListening() {
    if (this.isListening()) {
      this.recognition?.stop();
      this.isListening.set(false);
    } else {
      try {
        this.recognition?.start();
        this.isListening.set(true);
      } catch {
        this.simulate('go to dashboard');
      }
    }
  }

  simulate(command: string) {
    this.transcript.set(command);
    this.handleVoiceNavigation(command);
  }

  private handleVoiceNavigation(phrase: string) {
    const cmd = phrase.toLowerCase();
    let reply = '';

    if (cmd.includes('dashboard') || cmd.includes('डैशबोर्ड') || cmd.includes('ଡ୍ୟାସବୋର୍ଡ')) {
      reply = 'Redirecting to Dashboard...';
      this.botVoiceReply.set(reply);
      this.speak(reply);
      setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      return;
    }
    if (cmd.includes('chat') || cmd.includes('चैट') || cmd.includes('ଚାଟ୍')) {
      reply = 'Opening Krishi AI Chat...';
      this.botVoiceReply.set(reply);
      this.speak(reply);
      setTimeout(() => this.router.navigate(['/chat']), 1000);
      return;
    }
    if (cmd.includes('disease') || cmd.includes('leaf') || cmd.includes('scanner') || cmd.includes('रोग')) {
      reply = 'Opening Crop Disease Scanner...';
      this.botVoiceReply.set(reply);
      this.speak(reply);
      setTimeout(() => this.router.navigate(['/disease']), 1000);
      return;
    }

    reply = 'Command recognized: ' + phrase + '. Your farm status is optimal.';
    this.botVoiceReply.set(reply);
    this.speak(reply);
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    }
  }
}