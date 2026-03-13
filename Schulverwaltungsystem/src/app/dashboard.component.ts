import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolService, Schueler } from './school.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-slate-50">Dashboard</h2>
        <p class="text-sm text-slate-400">
          Überblick über alle Schüler im System.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
          <p class="text-xs text-slate-400">Total Students</p>
          <p class="mt-1 text-2xl font-semibold text-slate-50">
            {{ totalStudents() }}
          </p>
        </div>

        <div class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
          <p class="text-xs text-slate-400">Average Age</p>
          <p class="mt-1 text-2xl font-semibold text-slate-50">
            {{ averageAge() | number: '1.0-1' }}
          </p>
        </div>

        <div class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
          <p class="text-xs text-slate-400">Classes</p>
          <p class="mt-1 text-2xl font-semibold text-slate-50">
            {{ classCount() }}
          </p>
        </div>
      </div>

      <p *ngIf="errorMessage()" class="text-xs text-rose-400">
        {{ errorMessage() }}
      </p>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);

  private readonly schueler = signal<Schueler[]>([]);
  readonly errorMessage = signal('');

  readonly totalStudents = computed(() => this.schueler().length);

  readonly averageAge = computed(() => {
    const list = this.schueler();
    if (!list.length) {
      return 0;
    }
    const sum = list.reduce((acc, s) => acc + (s.alter ?? 0), 0);
    return sum / list.length;
  });

  readonly classCount = computed(() => {
    const list = this.schueler();
    const classes = new Set(list.map((s) => s.klasse).filter(Boolean));
    return classes.size;
  });

  ngOnInit(): void {
    this.schoolService.getAllSchueler().subscribe({
      next: (result) => {
        this.schueler.set(result);
        this.errorMessage.set('');
      },
      error: () => {
        this.schueler.set([]);
        this.errorMessage.set(
          'Fehler beim Laden der Dashboard-Daten (Backend erreichbar?).'
        );
      }
    });
  }
}

