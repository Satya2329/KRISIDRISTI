import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AiChatComponent } from './components/chat/ai-chat.component';
import { DiseaseScannerComponent } from './components/disease/disease-scanner.component';
import { VoiceAssistantComponent } from './components/voice/voice-assistant.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: AiChatComponent },
  { path: 'disease', component: DiseaseScannerComponent },
  { path: 'voice', component: VoiceAssistantComponent },
  { path: '**', redirectTo: 'dashboard' }
];