import {
  Component,
  signal,
  computed,
  effect,
  inject,
  Injectable,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  sources?: Array<{ uri: string; title: string }>;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  state: string;
}

const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', state: 'All India / Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'Uttar Pradesh / MP / Delhi / North India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', state: 'West Bengal / Tripura' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', state: 'Andhra Pradesh / Telangana' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', state: 'Maharashtra' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', state: 'Tamil Nadu / Puducherry' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', state: 'Jammu & Kashmir / Telangana / UP' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', state: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', state: 'Karnataka' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', state: 'Odisha' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', state: 'Kerala / Lakshadweep' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', state: 'Punjab' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', state: 'Assam' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', state: 'Bihar' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', state: 'Jharkhand / Odisha / WB' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', state: 'Jammu & Kashmir' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', state: 'Sikkim / West Bengal' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंکणी', state: 'Goa' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', state: 'Jammu & Kashmir' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'ꯃꯩꯇꯩꯂꯣᓐ', state: 'Manipur' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर'', state: 'Assam' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', state: 'Uttarakhand / Classical' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', state: 'Sindhi Community / All India' }
];

@Injectable({ providedIn: 'root' })
class AuthService {
  private currentUserSignal = signal<User | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  private getStoredUser(): User | null {
    const data = localStorage.getItem('app_user');
    if (data) {
      try { return JSON.parse(data); } catch (e) { return null; }
    }
    return { 
      id: 'usr_101', 
      name: 'Alex Johnson', 
      email: 'alex@nexus.ai', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 
      role: 'Pro AI Innovator' 
    };
  }

  login(email: string, pass: string): boolean {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      role: 'AI System Architect'
    };
    localStorage.setItem('app_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    return true;
  }

  register(name: string, email: string, pass: string): boolean {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      role: 'Standard Innovator'
    };
    localStorage.setItem('app_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    return true;
  }

  logout(): void {
    localStorage.removeItem('app_user');
    this.currentUserSignal.set(null);
  }
}

@Injectable({ providedIn: 'root' })
class GeminiService {
  private apiKey = "";

  async translateBulkText(texts: string[], targetLanguageName: string): Promise<Record<string, string>> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`;
    
    const prompt = `Translate the following UI text strings into ${targetLanguageName}. 
Return ONLY a valid JSON object mapping original English strings to translated strings.
English Strings: ${JSON.stringify(texts)}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const jsonStr = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
    } catch (e) {
      console.error('Translation error:', e);
    }
    return {};
  }

  async generateChatResponse(userQuery: string, systemPrompt?: string): Promise<{ text: string; sources?: Array<{ uri: string; title: string }> }> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`;
    const payload: Record<string, any> = {
      contents: [{ parts: [{ text: userQuery }] }],
      tools: [{ "google_search": {} }]
    };

    if (systemPrompt) {
      payload['systemInstruction'] = { parts: [{ text: systemPrompt }] };
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const candidate = result.candidates?.[0];
      
      if (candidate && candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;
        let sources: Array<{ uri: string; title: string }> = [];
        
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
          sources = groundingMetadata.groundingAttributions
            .map((attr: any) => ({ uri: attr.web?.uri, title: attr.web?.title }))
            .filter((src: any) => src.uri && src.title);
        }
        return { text, sources };
      }
      throw new Error('Invalid response structure from Gemini API');
    } catch (err) {
      console.error('Gemini Chat API Error:', err);
      return { text: "I am having trouble connecting right now. Please check your connection and try again." };
    }
  }

  async analyzeImage(base64Data: string, promptText: string = "Describe this image in detail and identify key elements."): Promise<string> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`;
    const cleanBase64 = base64Data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: "image/png",
                data: cleanBase64
              }
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available.";
    } catch (err) {
      console.error('Gemini Vision API Error:', err);
      return "Failed to analyze image content. Please try another image.";
    }
  }

  async generateTTS(textToSpeech: string, voiceName: string = "Kore"): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: textToSpeech }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType) {
        const sampleRateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;
        const pcmBuffer = this.base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmBuffer);
        const wavBlob = this.pcmToWav(pcm16, sampleRate);
        return URL.createObjectURL(wavBlob);
      }
      return null;
    } catch (e) {
      console.error("TTS API Error:", e);
      return null;
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private pcmToWav(pcm16: Int16Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + pcm16.length * 2);
    const view = new DataView(buffer);
    
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcm16.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, pcm16.length * 2, true);

    let offset = 44;
    for (let i = 0; i < pcm16.length; i++, offset += 2) {
      view.setInt16(offset, pcm16[i], true);
    }
    return new Blob([buffer], { type: 'audio/wav' });
  }
}

@Injectable({ providedIn: 'root' })
class VoiceRecognitionService {
  private speechRecognition: any = null;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';
    }
  }

  isSupported(): boolean {
    return !!this.speechRecognition;
  }

  startListening(onResult: (text: string) => void, onError?: () => void, onEnd?: () => void): void {
    if (!this.speechRecognition) return;

    this.speechRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    this.speechRecognition.onerror = () => { if (onError) onError(); };
    this.speechRecognition.onend = () => { if (onEnd) onEnd(); };

    try {
      this.speechRecognition.start();
    } catch (e) {
      if (onError) onError();
    }
  }

  stopListening(): void {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between shadow-xs">
      <div class="flex items-center space-x-3 cursor-pointer" (click)="navigate.emit('dashboard')">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <span class="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Nexus AI</span>
      </div>

      @if (currentUser) {
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Voice Command Button -->
          <button 
            (click)="toggleGlobalVoice.emit()" 
            [class]="isVoiceListening 
              ? 'px-3 py-1.5 rounded-xl bg-rose-500 text-white animate-pulse flex items-center space-x-2 text-xs font-bold shadow-lg' 
              : 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center space-x-2 text-xs font-semibold transition border border-slate-200 dark:border-slate-700'"
            title="Voice Control">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            <span class="hidden sm:inline">{{ isVoiceListening ? 'Listening Commands...' : 'Voice Command' }}</span>
          </button>

          <!-- Module Navigation Links -->
          <div class="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button (click)="navigate.emit('dashboard')" [class]="navBtnClass('dashboard')">{{ t('Dashboard') }}</button>
            <button (click)="navigate.emit('chat')" [class]="navBtnClass('chat')">{{ t('AI Chat') }}</button>
            <button (click)="navigate.emit('vision')" [class]="navBtnClass('vision')">{{ t('Image Vision') }}</button>
            <button (click)="navigate.emit('voice')" [class]="navBtnClass('voice')">{{ t('Talk Voice') }}</button>
          </div>

          <!-- Regional Language Dropdown -->
          <select 
            [value]="selectedLanguage.code" 
            (change)="onLangChange($event)" 
            class="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500">
            @for (lang of indianLanguages; track lang.code) {
              <option [value]="lang.code">{{ lang.nativeName }} ({{ lang.name }})</option>
            }
          </select>

          <!-- Dark Mode Toggle -->
          <button (click)="toggleDarkMode.emit()" class="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            @if (isDarkMode) {
              <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clip-rule="evenodd"/></svg>
            } @else {
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            }
          </button>

          <!-- User Badge & Logout -->
          <div class="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-3 sm:pl-4">
            <img [src]="currentUser?.avatar" alt="Avatar" class="w-8 h-8 rounded-full border border-indigo-400 object-cover"/>
            <div class="hidden sm:block text-left">
              <div class="text-xs font-semibold leading-tight">{{ currentUser?.name }}</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">{{ currentUser?.role }}</div>
            </div>
            <button (click)="logout.emit()" title="Logout" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      } @else {
        <div class="flex items-center space-x-3">
          <button (click)="navigate.emit('login')" class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition">Log In</button>
          <button (click)="navigate.emit('register')" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition">Get Started</button>
        </div>
      }
    </nav>
  `
})
class NavbarComponent {
  @Input() currentUser: User | null = null;
  @Input() currentRoute: string = 'dashboard';
  @Input() isDarkMode: boolean = false;
  @Input() isVoiceListening: boolean = false;
  @Input() selectedLanguage: LanguageOption = INDIAN_LANGUAGES[0];
  @Input() translationsCache: Record<string, string> = {};

  indianLanguages = INDIAN_LANGUAGES;

  @Output() navigate = new EventEmitter<'login' | 'register' | 'dashboard' | 'chat' | 'vision' | 'voice'>();
  @Output() toggleGlobalVoice = new EventEmitter<void>();
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() selectLanguage = new EventEmitter<LanguageOption>();

  navBtnClass(route: string): string {
    const active = this.currentRoute === route;
    return `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
      active 
        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
    }`;
  }

  t(englishText: string): string {
    if (this.selectedLanguage?.code === 'en') return englishText;
    return this.translationsCache?.[englishText] || englishText;
  }

  onLangChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const lang = this.indianLanguages.find(l => l.code === target.value);
    if (lang) {
      this.selectLanguage.emit(lang);
    }
  }
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <!-- Indian Languages Quick Switcher Header -->
      <div class="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-6 rounded-3xl text-white shadow-xl space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold flex items-center space-x-2">
              <span>🇮🇳 {{ t('Indian Regional Languages Translator') }}</span>
            </h2>
            <p class="text-xs text-amber-100 mt-1">Select any of India's 22 official state languages to convert the portal dynamically.</p>
          </div>

          <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/30">
            <span class="text-xs font-semibold px-2">Active Language:</span>
            <span class="bg-white text-slate-900 px-3 py-1 rounded-xl text-xs font-bold">{{ selectedLanguage.nativeName }} ({{ selectedLanguage.name }})</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-2">
          @for (lang of indianLanguages; track lang.code) {
            <button 
              (click)="selectLanguage.emit(lang)"
              [class]="selectedLanguage.code === lang.code 
                ? 'bg-white text-indigo-900 font-bold shadow-md scale-105' 
                : 'bg-black/20 hover:bg-white/30 text-white font-medium'"
              class="px-2.5 py-2 rounded-xl text-xs transition duration-200 flex flex-col items-center justify-center text-center">
              <span class="text-xs leading-tight font-semibold">{{ lang.nativeName }}</span>
              <span class="text-[9px] opacity-80 truncate max-w-full">{{ lang.name }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-10 text-white shadow-2xl">
        <div class="relative z-10 max-w-2xl">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">{{ t('Hello') }}, {{ currentUser?.name }} 👋</h1>
          <p class="mt-3 text-indigo-100 text-base sm:text-lg">{{ t('Welcome to your central AI command dashboard. Choose a module below to start generating text, analyzing visual content, or holding natural voice dialogs.') }}</p>
          
          <div class="mt-6 flex flex-wrap gap-4">
            <button (click)="navigate.emit('chat')" class="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-opacity-90 shadow-md transition">{{ t('Start AI Chat') }}</button>
            <button (click)="navigate.emit('vision')" class="px-5 py-2.5 bg-indigo-700/50 hover:bg-indigo-700 text-white font-semibold rounded-xl border border-white/20 transition">{{ t('Upload Image') }}</button>
            <button (click)="testVoiceRedirect.emit('go to chat')" class="px-4 py-2.5 bg-rose-500/80 hover:bg-rose-600 text-white font-semibold rounded-xl transition flex items-center space-x-2 text-xs">
              <span>🎙 {{ t('Test Voice Redirect ("go to chat")') }}</span>
            </button>
          </div>
        </div>
        <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      <!-- Core Feature Cards -->
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">{{ t('Core Intelligence Tools') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div (click)="navigate.emit('chat')" class="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">{{ t('AI Conversational Chat') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('Engage with Gemini LLM models with search grounding, custom prompt presets, and code syntax support.') }}</p>
            </div>
            <div class="mt-6 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {{ t('Launch Chat Console') }} <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>
          </div>

          <div (click)="navigate.emit('vision')" class="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition">{{ t('Vision & Image Upload') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('Drag & drop images to extract metadata, perform multi-modal visual analysis, and simulate filters.') }}</p>
            </div>
            <div class="mt-6 flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400">
              {{ t('Open Image Studio') }} <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>
          </div>

          <div (click)="navigate.emit('voice')" class="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-600 transition">{{ t('Talk with Voice') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('Conversational AI voice agent with real-time speech input & TTS voice synthesis.') }}</p>
            </div>
            <div class="mt-6 flex items-center text-sm font-semibold text-pink-600 dark:text-pink-400">
              {{ t('Connect Voice Session') }} <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
class DashboardComponent {
  @Input() currentUser: User | null = null;
  @Input() selectedLanguage: LanguageOption = INDIAN_LANGUAGES[0];
  @Input() translationsCache: Record<string, string> = {};

  indianLanguages = INDIAN_LANGUAGES;

  @Output() navigate = new EventEmitter<'login' | 'register' | 'dashboard' | 'chat' | 'vision' | 'voice'>();
  @Output() selectLanguage = new EventEmitter<LanguageOption>();
  @Output() testVoiceRedirect = new EventEmitter<string>();

  t(englishText: string): string {
    if (this.selectedLanguage?.code === 'en') return englishText;
    return this.translationsCache?.[englishText] || englishText;
  }
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="font-bold text-slate-900 dark:text-white">Gemini 3 Flash LLM</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">Google Search Grounding</span>
        </div>
        <div class="flex items-center space-x-2">
          <button (click)="clearChat()" class="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">{{ t('Clear History') }}</button>
        </div>
      </div>

      <div #chatContainer class="flex-1 overflow-y-auto p-6 space-y-6">
        @for (msg of chatMessages(); track msg.id) {
          <div [class]="msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div [class]="msg.sender === 'user' 
              ? 'max-w-2xl bg-indigo-600 text-white rounded-2xl rounded-tr-none px-5 py-3.5 shadow-md' 
              : 'max-w-2xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-md'">
              <div class="text-xs opacity-75 mb-1 font-semibold">{{ msg.sender === 'user' ? t('You') : 'Nexus AI' }}</div>
              <div class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.text }}</div>
              
              @if (msg.sources && msg.sources.length > 0) {
                <div class="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600 text-xs">
                  <span class="font-semibold block mb-1">{{ t('Grounding Sources') }}:</span>
                  <div class="flex flex-wrap gap-2">
                    @for (src of msg.sources; track src.uri) {
                      <a [href]="src.uri" target="_blank" class="text-indigo-500 dark:text-indigo-300 hover:underline truncate max-w-xs block">🔗 {{ src.title }}</a>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (isChatLoading()) {
          <div class="flex justify-start">
            <div class="bg-slate-100 dark:bg-slate-700 text-slate-500 px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center space-x-2">
              <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
              <span class="text-xs font-medium ml-2">{{ t('Thinking & Search Grounding...') }}</span>
            </div>
          </div>
        }
      </div>

      <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div class="flex items-center space-x-2">
          <button 
            (click)="dictateSpeech(chatInput)" 
            [class]="isListeningInput() ? 'p-3 bg-rose-500 text-white rounded-xl animate-pulse' : 'p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 rounded-xl transition'"
            title="Speak query">
            🎤
          </button>
          <input #chatInput (keyup.enter)="sendChatMessage(chatInput.value); chatInput.value=''" type="text" [placeholder]="t('Type your prompt or speak into mic...')" class="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm" />
          <button (click)="sendChatMessage(chatInput.value); chatInput.value=''" [disabled]="isChatLoading()" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50">{{ t('Send') }}</button>
        </div>
      </div>
    </div>
  `
})
class ChatComponent {
  private geminiService = inject(GeminiService);
  private voiceService = inject(VoiceRecognitionService);

  @Input() selectedLanguage: LanguageOption = INDIAN_LANGUAGES[0];
  @Input() translationsCache: Record<string, string> = {};

  chatMessages = signal<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your AI assistant powered by Gemini 3 Flash. How can I assist you today?', timestamp: new Date() }
  ]);
  isChatLoading = signal<boolean>(false);
  isListeningInput = signal<boolean>(false);

  t(englishText: string): string {
    if (this.selectedLanguage?.code === 'en') return englishText;
    return this.translationsCache?.[englishText] || englishText;
  }

  async sendChatMessage(text: string): Promise<void> {
    if (!text || !text.trim() || this.isChatLoading()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    this.chatMessages.update(msgs => [...msgs, userMsg]);
    this.isChatLoading.set(true);

    const res = await this.geminiService.generateChatResponse(text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: res.text,
      timestamp: new Date(),
      sources: res.sources
    };

    this.chatMessages.update(msgs => [...msgs, aiMsg]);
    this.isChatLoading.set(false);
  }

  dictateSpeech(targetElement: HTMLInputElement): void {
    if (!this.voiceService.isSupported()) return;
    this.isListeningInput.set(true);
    this.voiceService.startListening(
      (transcript) => {
        targetElement.value = (targetElement.value ? targetElement.value + ' ' : '') + transcript;
        this.isListeningInput.set(false);
      },
      () => this.isListeningInput.set(false),
      () => this.isListeningInput.set(false)
    );
  }

  clearChat(): void {
    this.chatMessages.set([
      { id: '1', sender: 'ai', text: 'Chat history cleared. How can I help you now?', timestamp: new Date() }
    ]);
  }
}

@Component({
  selector: 'app-vision',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="border-b border-slate-200 dark:border-slate-700 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t('Vision & Image Upload Studio') }}</h1>
          <p class="text-slate-500 text-sm">{{ t('Upload images or use voice commands to trigger image selector and analyze content') }}</p>
        </div>

        <button (click)="triggerVoiceImageSelector.emit()" class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md text-xs flex items-center space-x-2 hover:opacity-90 transition">
          <span>🎙️ {{ t('Voice Trigger Image Selector ("Select Image")') }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div 
            (drop)="handleFileDrop($event)" 
            (dragover)="$event.preventDefault()" 
            class="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400 rounded-3xl p-8 text-center bg-slate-50 dark:bg-slate-800/50 transition cursor-pointer flex flex-col items-center justify-center min-h-[300px]"
            (click)="fileInput.click()">
            
            @if (selectedImageBase64()) {
              <img [src]="selectedImageBase64()" class="max-h-64 rounded-2xl shadow-lg object-contain" alt="Uploaded Preview" />
            } @else {
              <div class="w-16 h-16 bg-purple-100 dark:bg-purple-950/50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <p class="text-slate-700 dark:text-slate-200 font-semibold">{{ t('Drag and drop your image here or say "select image"') }}</p>
              <p class="text-slate-400 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
            }
            
            <input #fileInput type="file" (change)="handleFileSelect($event)" accept="image/*" class="hidden" />
          </div>

          <div class="flex space-x-3">
            <button (click)="fileInput.click()" class="flex-1 py-3 px-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-300 transition text-sm">{{ t('Select File') }}</button>
            <button (click)="analyzeCurrentImage()" [disabled]="!selectedImageBase64() || isVisionLoading()" class="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50 text-sm">
              {{ isVisionLoading() ? t('Analyzing Image...') : t('Analyze with Gemini') }}
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">{{ t('Analysis Report') }}</h3>
          <div class="flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl overflow-y-auto text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            @if (isVisionLoading()) {
              <div class="flex flex-col items-center justify-center h-full py-12 space-y-3">
                <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs text-slate-400 font-medium">{{ t('Processing multimodal visual embeddings...') }}</span>
              </div>
            } @else if (visionAnalysisResult()) {
              <div class="whitespace-pre-wrap">{{ visionAnalysisResult() }}</div>
            } @else {
              <div class="text-slate-400 text-center py-16">{{ t('Upload an image and click analyze to see detailed computer vision findings.') }}</div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
class VisionComponent {
  private geminiService = inject(GeminiService);

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  @Input() selectedLanguage: LanguageOption = INDIAN_LANGUAGES[0];
  @Input() translationsCache: Record<string, string> = {};

  selectedImageBase64 = signal<string | null>(null);
  visionAnalysisResult = signal<string | null>(null);
  isVisionLoading = signal<boolean>(false);

  @Output() triggerVoiceImageSelector = new EventEmitter<void>();

  t(englishText: string): string {
    if (this.selectedLanguage?.code === 'en') return englishText;
    return this.translationsCache?.[englishText] || englishText;
  }

  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.readFile(input.files[0]);
    }
  }

  handleFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.readFile(event.dataTransfer.files[0]);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImageBase64.set(reader.result as string);
      this.visionAnalysisResult.set(null);
    };
    reader.readAsDataURL(file);
  }

  async analyzeCurrentImage(): Promise<void> {
    const img = this.selectedImageBase64();
    if (!img) return;

    this.isVisionLoading.set(true);
    const result = await this.geminiService.analyzeImage(img);
    this.visionAnalysisResult.set(result);
    this.isVisionLoading.set(false);
  }

  openFileInput(): void {
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.click();
    }
  }
}

@Component({
  selector: 'app-voice',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">{{ t('Interactive Voice & Speech-to-Talk Studio') }}</h1>
        <p class="text-slate-500 text-sm">{{ t('Speak into mic or type to synthesize AI voices in Indian state languages or English.') }}</p>
      </div>

      <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
        <div class="h-28 flex items-center justify-center space-x-1.5 bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-inner">
          @for (bar of waveBars; track $index) {
            <div [style.height.px]="isVoicePlaying() ? bar.height : 8" class="w-2 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full transition-all duration-150"></div>
          }
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          @for (v of voices; track v) {
            <button (click)="selectedVoice.set(v)" [class]="selectedVoice() === v ? 'px-4 py-2 bg-pink-600 text-white font-semibold rounded-xl shadow-md text-xs' : 'px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 transition'">
              Voice: {{ v }}
            </button>
          }
        </div>

        <div class="space-y-3">
          <div class="relative">
            <textarea #voiceInput rows="3" class="w-full p-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 text-sm" [placeholder]="t('Speak or enter text here for Gemini to synthesize aloud...')"></textarea>
            
            <button 
              (click)="dictateSpeech(voiceInput)" 
              [class]="isListeningInput() ? 'absolute right-3 top-3 p-2.5 bg-rose-500 text-white rounded-xl animate-pulse' : 'absolute right-3 top-3 p-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-pink-100 rounded-xl transition'"
              title="Dictate voice">
              🎤
            </button>
          </div>

          <button (click)="speakText(voiceInput.value)" [disabled]="isVoiceLoading()" class="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50">
            {{ isVoiceLoading() ? t('Synthesizing PCM Audio...') : t('🔊 Speak Text Aloud') }}
          </button>
        </div>
      </div>
    </div>
  `
})
class VoiceComponent implements OnDestroy {
  private geminiService = inject(GeminiService);
  private voiceService = inject(VoiceRecognitionService);

  @Input() selectedLanguage: LanguageOption = INDIAN_LANGUAGES[0];
  @Input() translationsCache: Record<string, string> = {};

  voices = ['Kore', 'Puck', 'Zephyr', 'Fenrir', 'Aoede'];
  selectedVoice = signal<string>('Kore');
  isVoiceLoading = signal<boolean>(false);
  isVoicePlaying = signal<boolean>(false);
  isListeningInput = signal<boolean>(false);
  waveBars = Array.from({ length: 24 }, () => ({ height: 10 }));

  private waveInterval: any;
  private currentAudio: HTMLAudioElement | null = null;

  t(englishText: string): string {
    if (this.selectedLanguage?.code === 'en') return englishText;
    return this.translationsCache?.[englishText] || englishText;
  }

  dictateSpeech(targetElement: HTMLTextAreaElement): void {
    if (!this.voiceService.isSupported()) return;
    this.isListeningInput.set(true);
    this.voiceService.startListening(
      (transcript) => {
        targetElement.value = (targetElement.value ? targetElement.value + ' ' : '') + transcript;
        this.isListeningInput.set(false);
      },
      () => this.isListeningInput.set(false),
      () => this.isListeningInput.set(false)
    );
  }

  async speakText(text: string): Promise<void> {
    if (!text || !text.trim() || this.isVoiceLoading()) return;

    this.isVoiceLoading.set(true);
    const audioUrl = await this.geminiService.generateTTS(text, this.selectedVoice());
    this.isVoiceLoading.set(false);

    if (audioUrl) {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.play();
      this.isVoicePlaying.set(true);
      this.startWaveAnimation();

      this.currentAudio.onended = () => {
        this.isVoicePlaying.set(false);
        this.stopWaveAnimation();
      };
    }
  }

  startWaveAnimation(): void {
    this.stopWaveAnimation();
    this.waveInterval = setInterval(() => {
      this.waveBars = this.waveBars.map(() => ({
        height: Math.floor(Math.random() * 70) + 10
      }));
    }, 150);
  }

  stopWaveAnimation(): void {
    if (this.waveInterval) {
      clearInterval(this.waveInterval);
    }
    this.waveBars = this.waveBars.map(() => ({ height: 10 }));
  }

  ngOnDestroy(): void {
    this.stopWaveAnimation();
  }
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto my-12 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign in to access your AI innovation suite</p>
      </div>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
          <input type="email" formControlName="email" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="alex@nexus.ai"/>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Password</label>
          <input type="password" formControlName="password" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••"/>
        </div>
        <button type="submit" [disabled]="loginForm.invalid" class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50">Sign In</button>
      </form>
      <div class="text-center mt-6 text-sm text-slate-500">
        Don't have an account? <a (click)="navigate.emit('register')" class="text-indigo-600 font-semibold cursor-pointer hover:underline">Register</a>
      </div>
    </div>
  `
})
class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @Output() navigate = new EventEmitter<'login' | 'register' | 'dashboard' | 'chat' | 'vision' | 'voice'>();

  loginForm: FormGroup = this.fb.group({
    email: ['alex@nexus.ai', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.authService.login(email, password)) {
        this.navigate.emit('dashboard');
      }
    }
  }
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto my-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Start exploring cutting-edge AI features</p>
      </div>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
          <input type="text" formControlName="name" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Alex Johnson"/>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
          <input type="email" formControlName="email" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="alex@nexus.ai"/>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Password</label>
          <input type="password" formControlName="password" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••"/>
        </div>
        <button type="submit" [disabled]="registerForm.invalid" class="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50">Create Account</button>
      </form>
      <div class="text-center mt-6 text-sm text-slate-500">
        Already registered? <a (click)="navigate.emit('login')" class="text-indigo-600 font-semibold cursor-pointer hover:underline">Sign In</a>
      </div>
    </div>
  `
})
class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @Output() navigate = new EventEmitter<'login' | 'register' | 'dashboard' | 'chat' | 'vision' | 'voice'>();

  registerForm: FormGroup = this.fb.group({
    name: ['Alex Johnson', Validators.required],
    email: ['alex@nexus.ai', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      if (this.authService.register(name, email, password)) {
        this.navigate.emit('dashboard');
      }
    }
  }
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    NavbarComponent, 
    DashboardComponent, 
    ChatComponent, 
    VisionComponent, 
    VoiceComponent, 
    LoginComponent, 
    RegisterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      <!-- Top Navigation Component -->
      <app-navbar 
        [currentUser]="authService.currentUser()"
        [currentRoute]="currentRoute()"
        [isDarkMode]="isDarkMode()"
        [isVoiceListening]="isVoiceListening()"
        [selectedLanguage]="selectedLanguage()"
        [translationsCache]="translationsCache()"
        (navigate)="navigate($event)"
        (toggleGlobalVoice)="toggleGlobalVoiceListening()"
        (toggleDarkMode)="toggleDarkMode()"
        (logout)="logout()"
        (selectLanguage)="setLanguage($event)" />

      <!-- Spoken Voice Navigation Feedback Banner -->
      @if (lastSpokenCommand()) {
        <div class="bg-indigo-600 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center space-x-2 animate-bounce">
          <span>🎙️ Voice Input Recognized: "{{ lastSpokenCommand() }}"</span>
          @if (voiceNavigationNotice()) {
            <span class="bg-indigo-800 px-2 py-0.5 rounded-md text-[11px] font-bold">➜ {{ voiceNavigationNotice() }}</span>
          }
        </div>
      }

      <!-- Main Dynamic Content Views -->
      <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        @switch (currentRoute()) {
          @case ('login') {
            <app-login (navigate)="navigate($event)" />
          }
          @case ('register') {
            <app-register (navigate)="navigate($event)" />
          }
          @case ('dashboard') {
            <app-dashboard 
              [currentUser]="authService.currentUser()"
              [selectedLanguage]="selectedLanguage()"
              [translationsCache]="translationsCache()"
              (navigate)="navigate($event)"
              (selectLanguage)="setLanguage($event)"
              (testVoiceRedirect)="testVoiceNavigation($event)" />
          }
          @case ('chat') {
            <app-chat 
              [selectedLanguage]="selectedLanguage()"
              [translationsCache]="translationsCache()" />
          }
          @case ('vision') {
            <app-vision 
              #visionComp
              [selectedLanguage]="selectedLanguage()"
              [translationsCache]="translationsCache()"
              (triggerVoiceImageSelector)="triggerVoiceImageSelector()" />
          }
          @case ('voice') {
            <app-voice 
              [selectedLanguage]="selectedLanguage()"
              [translationsCache]="translationsCache()" />
          }
        }
      </main>
    </div>
  `
})
export class App {
  readonly authService = inject(AuthService);
  readonly geminiService = inject(GeminiService);
  readonly voiceService = inject(VoiceRecognitionService);

  @ViewChild('visionComp') visionComp?: VisionComponent;

  selectedLanguage = signal<LanguageOption>(INDIAN_LANGUAGES[0]);
  translationsCache = signal<Record<string, string>>({});

  currentRoute = signal<'login' | 'register' | 'dashboard' | 'chat' | 'vision' | 'voice'>('dashboard');
  isDarkMode = signal<boolean>(false);

  isVoiceListening = signal<boolean>(false);
  lastSpokenCommand = signal<string | null>(null);
  voiceNavigationNotice = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.authService.isAuthenticated() && this.currentRoute() !== 'login' && this.currentRoute() !== 'register') {
        this.currentRoute.set('login');
      }
    });
  }

  toggleGlobalVoiceListening(): void {
    if (!this.voiceService.isSupported()) {
      this.voiceNavigationNotice.set('Speech recognition is not supported in this browser');
      return;
    }

    if (this.isVoiceListening()) {
      this.voiceService.stopListening();
      this.isVoiceListening.set(false);
    } else {
      this.isVoiceListening.set(true);
      this.voiceService.startListening(
        (transcript) => {
          this.handleVoiceCommand(transcript.toLowerCase().trim());
          this.isVoiceListening.set(false);
        },
        () => this.isVoiceListening.set(false),
        () => this.isVoiceListening.set(false)
      );
    }
  }

  handleVoiceCommand(spokenText: string): void {
    this.lastSpokenCommand.set(spokenText);

    if (spokenText.includes('dashboard') || spokenText.includes('home')) {
      this.voiceNavigationNotice.set('Redirecting to Dashboard');
      this.navigate('dashboard');
    } else if (spokenText.includes('chat') || spokenText.includes('talk ai')) {
      this.voiceNavigationNotice.set('Redirecting to AI Chat');
      this.navigate('chat');
    } else if (spokenText.includes('vision') || spokenText.includes('image') || spokenText.includes('photo')) {
      this.voiceNavigationNotice.set('Redirecting to Vision Studio');
      this.navigate('vision');
      if (spokenText.includes('select') || spokenText.includes('upload') || spokenText.includes('choose')) {
        setTimeout(() => this.triggerImageSelector(), 500);
      }
    } else if (spokenText.includes('voice') || spokenText.includes('speak') || spokenText.includes('audio')) {
      this.voiceNavigationNotice.set('Redirecting to Voice Assistant');
      this.navigate('voice');
    } else {
      this.voiceNavigationNotice.set(`Processed query: "${spokenText}"`);
    }

    setTimeout(() => {
      this.voiceNavigationNotice.set(null);
    }, 4000);
  }

  testVoiceNavigation(command: string): void {
    this.handleVoiceCommand(command);
  }

  triggerVoiceImageSelector(): void {
    this.handleVoiceCommand('go to vision and select image');
  }

  triggerImageSelector(): void {
    if (this.visionComp) {
      this.visionComp.openFileInput();
    }
  }

  async setLanguage(lang: LanguageOption): Promise<void> {
    this.selectedLanguage.set(lang);
    if (lang.code === 'en') {
      this.translationsCache.set({});
      return;
    }

    const textToTranslate = [
      'Dashboard', 'AI Chat', 'Image Vision', 'Talk Voice', 'Hello', 
      'Welcome to your central AI command dashboard. Choose a module below to start generating text, analyzing visual content, or holding natural voice dialogs.',
      'Start AI Chat', 'Upload Image', 'Core Intelligence Tools',
      'AI Conversational Chat', 'Engage with Gemini LLM models with search grounding, custom prompt presets, and code syntax support.',
      'Launch Chat Console', 'Vision & Image Upload', 'Drag & drop images to extract metadata, perform multi-modal visual analysis, and simulate filters.',
      'Open Image Studio', 'Talk with Voice', 'Conversational AI voice agent with real-time speech input & TTS voice synthesis.',
      'Connect Voice Session', 'Clear History', 'Grounding Sources', 'Thinking & Search Grounding...', 'Type your prompt or speak into mic...',
      'Send', 'Vision & Image Upload Studio', 'Upload images or use voice commands to trigger image selector and analyze content',
      'Drag and drop your image here or say "select image"', 'Select File', 'Analyze with Gemini', 'Analysis Report',
      'Interactive Voice & Speech-to-Talk Studio', 'Speak into mic or type to synthesize AI voices in Indian state languages or English.',
      'Speak or enter text here for Gemini to synthesize aloud...', '🔊 Speak Text Aloud', 'Indian Regional Languages Translator'
    ];

    const translatedMap = await this.geminiService.translateBulkText(textToTranslate, lang.name);
    this.translationsCache.set(translatedMap);
  }

  navigate(route: 'login' | 'register' | 'dashboard' | 'chat' | 'vision' | 'voice'): void {
    this.currentRoute.set(route);
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.navigate('login');
  }
}