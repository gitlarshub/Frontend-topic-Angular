import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolService, Schueler } from './school.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-slate-50">Analytics</h2>
        <p class="text-sm text-slate-400">
          Geschlechterverteilung der Schüler.
        </p>
      </div>

      <section class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <h3 class="mb-2 text-sm font-semibold text-slate-100">
          Geschlechterverteilung
        </h3>

        <div class="mb-2 text-xs text-slate-400">
          Basis: {{ total() }} Schüler
        </div>

        <div class="space-y-1 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-24 text-slate-300">Männlich</span>
            <div class="h-2 flex-1 rounded-full bg-slate-800">
              <div
                class="h-2 rounded-full bg-sky-500"
                [style.width.%]="malePercent()"
              ></div>
            </div>
            <span class="w-12 text-right text-slate-200">
              {{ malePercent() | number: '1.0-1' }}%
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-24 text-slate-300">Weiblich</span>
            <div class="h-2 flex-1 rounded-full bg-slate-800">
              <div
                class="h-2 rounded-full bg-rose-500"
                [style.width.%]="femalePercent()"
              ></div>
            </div>
            <span class="w-12 text-right text-slate-200">
              {{ femalePercent() | number: '1.0-1' }}%
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-24 text-slate-300">Unbekannt</span>
            <div class="h-2 flex-1 rounded-full bg-slate-800">
              <div
                class="h-2 rounded-full bg-amber-500"
                [style.width.%]="otherPercent()"
              ></div>
            </div>
            <span class="w-12 text-right text-slate-200">
              {{ otherPercent() | number: '1.0-1' }}%
            </span>
          </div>
        </div>

        <p *ngIf="studentsError()" class="mt-2 text-xs text-rose-400">
          {{ studentsError() }}
        </p>
      </section>
    </div>
  `
})
export class AnalyticsPageComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  readonly students = signal<Schueler[]>([]);
  readonly studentsError = signal('');

  total = () => this.students().length;
  malePercent = () => (this.total() > 0 ? (this.students().filter(s => s.geschlecht?.toLowerCase().startsWith('m')).length / this.total()) * 100 : 0);
  femalePercent = () => (this.total() > 0 ? (this.students().filter(s => s.geschlecht?.toLowerCase().startsWith('w')).length / this.total()) * 100 : 0);
  otherPercent = () => 100 - this.malePercent() - this.femalePercent();

  ngOnInit(): void {
    this.schoolService.getAllSchueler().subscribe({
      next: (result) => {
        this.students.set(result);
      },
      error: () => {
        this.students.set([]);
        this.studentsError.set(
          'Fehler beim Laden der Schülerdaten für Analytics.'
        );
      }
    });
  }
}

