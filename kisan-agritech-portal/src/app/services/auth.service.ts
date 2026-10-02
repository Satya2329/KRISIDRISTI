import { Injectable, signal, computed } from '@angular/core';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<UserProfile | null>({
    name: 'Ramesh Patel',
    phone: '9876543210',
    state: 'Odisha / Sambalpur',
    primaryCrop: 'Rice (Paddy)'
  });

  isLoggedIn = computed(() => this.currentUser() !== null);

  login(phone: string): boolean {
    this.currentUser.set({
      name: 'Ramesh Patel',
      phone: phone || '9876543210',
      state: 'Odisha / Sambalpur',
      primaryCrop: 'Rice (Paddy)'
    });
    return true;
  }

  register(name: string, phone: string, state: string, crop: string): boolean {
    this.currentUser.set({
      name: name || 'Farmer Bandhu',
      phone: phone || '9876543210',
      state: state || 'India',
      primaryCrop: crop || 'General Crop'
    });
    return true;
  }

  logout() {
    this.currentUser.set(null);
  }
}