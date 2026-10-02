import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DiseaseSample } from '../../models/disease.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-disease-scanner',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-md">
        <div>
          <h2 class="text-2xl font-black text-slate-800">{{ lang.t('imageUploadTitle') }}</h2>
          <p class="text-xs text-slate-500">Upload an image or pick a verified leaf sample for diagnosis.</p>
        </div>
        <div class="flex items-center gap-2">
          <input [(ngModel)]="cmd" (keyup.enter)="runCmd()" placeholder="type 'go to dashboard'..." class="text-xs px-3 py-2 border rounded-xl outline-none w-48" />
          <button (click)="runCmd()" class="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer">Run</button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (s of testSamples; track s.id) {
          <div (click)="selected.set(s)" [class]="selected()?.id === s.id ? 'border-2 border-emerald-600 bg-emerald-50' : 'border border-slate-200 bg-white'" class="p-3 rounded-2xl cursor-pointer transition-all hover:border-emerald-300">
            <img [src]="s.imageUrl" class="h-24 w-full object-cover rounded-xl mb-2" />
            <div class="font-bold text-xs truncate">{{ s.name }}</div>
            <div class="text-[11px] text-emerald-700 font-semibold">{{ s.crop }}</div>
          </div>
        }
      </div>

      @if (selected(); as report) {
        <div class="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md space-y-4">
          <div class="flex justify-between items-center border-b pb-3">
            <div>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{{ report.crop }}</span>
              <h3 class="text-xl font-bold text-slate-800 mt-1">{{ report.name }}</h3>
              <p class="text-xs text-slate-500">Condition: {{ report.condition }}</p>
            </div>
            <div class="text-right">
              <span class="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
              <div class="text-2xl font-black text-emerald-600">{{ report.confidence }}%</div>
            </div>
          </div>
          <div class="p-4 bg-emerald-50 rounded-2xl text-xs text-emerald-900">
            <strong>Prescribed Treatment:</strong> {{ report.cure }}
          </div>
          <div class="p-4 bg-amber-50 rounded-2xl text-xs text-amber-900">
            <strong>Prevention:</strong> {{ report.preventiveMeasure }}
          </div>
        </div>
      }
    </div>
  `
})
export class DiseaseScannerComponent {
  cmd = '';
  testSamples: DiseaseSample[] = [
    { id: '1', name: 'Healthy Leaf Specimen', crop: 'Tomato', condition: 'Vigorous Growth', severity: 'Healthy', confidence: 99, cure: 'No action required. Regular drip irrigation.', preventiveMeasure: 'Use organic mulch to prevent splash contamination.', imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=300&q=80' },
    { id: '2', name: 'Late Blight (Phytophthora)', crop: 'Potato', condition: 'Dark Lesions', severity: 'Severe', confidence: 94, cure: 'Apply Mancozeb 75% WP @ 2.5g/L immediately.', preventiveMeasure: 'Improve row spacing and aerate foliage.', imageUrl: 'https://images.unsplash.com/photo-1596726915570-5b53d0fc7f42?auto=format&fit=crop&w=300&q=80' },
    { id: '3', name: 'Paddy Blast (Magnaporthe)', crop: 'Rice (Paddy)', condition: 'Spindle-shaped Spots', severity: 'Moderate', confidence: 92, cure: 'Spray Tricyclazole 75% WP @ 0.6g/L water.', preventiveMeasure: 'Avoid excessive nitrogenous fertilizer application.', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80' },
    { id: '4', name: 'Yellow Rust (Puccinia)', crop: 'Wheat', condition: 'Yellow Pustules', severity: 'Moderate', confidence: 96, cure: 'Spray Propiconazole 25% EC (Tilt) @ 1 ml/L.', preventiveMeasure: 'Grow rust-resistant certified seed varieties.', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80' }
  ];
  selected = signal<DiseaseSample | null>(this.testSamples[0]);

  constructor(public lang: LanguageService, private router: Router) {}

  runCmd() {
    if (this.cmd.toLowerCase().includes('dashboard')) {
      this.router.navigate(['/dashboard']);
    } else if (this.cmd.toLowerCase().includes('chat')) {
      this.router.navigate(['/chat']);
    }
  }
}