import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService, Schueler } from './school.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-slate-50">Analytics</h2>
        <p class="text-sm text-slate-400">
          Geschlechteranteil und Raum-Unterrichtbarkeit.
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

      <section class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <h3 class="mb-2 text-sm font-semibold text-slate-100">
          Kann in Klasse unterrichtet werden?
        </h3>

        <form
          (ngSubmit)="onCheck()"
          class="grid gap-3 md:grid-cols-[2fr,2fr,auto]"
        >
          <label class="flex flex-col text-xs font-medium text-slate-300">
            Klasse
            <input
              [(ngModel)]="klasse"
              name="klasse"
              type="text"
              placeholder="z.B. 4AWI"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <label class="flex flex-col text-xs font-medium text-slate-300">
            Raumname
            <input
              [(ngModel)]="raumName"
              name="raumName"
              type="text"
              placeholder="z.B. B204"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <div class="flex items-end">
            <button
              type="submit"
              [disabled]="!klasse.trim() || !raumName.trim() || loading"
              class="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-800"
            >
              <span *ngIf="!loading">Prüfen</span>
              <span *ngIf="loading">Prüfe…</span>
            </button>
          </div>
        </form>

        <p *ngIf="kannUnterrichtenResult()" class="mt-2 text-xs text-emerald-400">
          {{ kannUnterrichtenResult() }}
        </p>
        <p *ngIf="kannUnterrichtenError()" class="mt-2 text-xs text-rose-400">
          {{ kannUnterrichtenError() }}
        </p>
      </section>
    </div>
  `
})
export class AnalyticsPageComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);

  private readonly students = signal<Schueler[]>([]);
  readonly studentsError = signal('');

  readonly total = computed(() => this.students().length);

  private readonly maleCount = computed(
    () => this.students().filter((s) => s.geschlecht === 'männlich').length
  );
  private readonly femaleCount = computed(
    () => this.students().filter((s) => s.geschlecht === 'weiblich').length
  );

  private readonly otherCount = computed(
    () =>
      this.students().length -
      (this.maleCount() + this.femaleCount())
  );

  readonly malePercent = computed(() =>
    this.total() ? (this.maleCount() / this.total()) * 100 : 0
  );

  readonly femalePercent = computed(() =>
    this.total() ? (this.femaleCount() / this.total()) * 100 : 0
  );

  readonly otherPercent = computed(() =>
    this.total() ? (this.otherCount() / this.total()) * 100 : 0
  );

  klasse = '';
  raumName = '';
  loading = false;
  readonly kannUnterrichtenResult = signal('');
  readonly kannUnterrichtenError = signal('');

  ngOnInit(): void {
    this.schoolService.getAllSchueler().subscribe({
      next: (result) => {
        this.students.set(result);
        this.studentsError.set('');
      },
      error: () => {
        this.students.set([]);
        this.studentsError.set(
          'Fehler beim Laden der Schülerdaten für Analytics.'
        );
      }
    });
  }

  onCheck(): void {
    if (!this.klasse.trim() || !this.raumName.trim() || this.loading) {
      return;
    }

    this.kannUnterrichtenResult.set('');
    this.kannUnterrichtenError.set('');
    this.loading = true;

    this.schoolService
      .checkKannUnterrichten(this.klasse.trim(), this.raumName.trim())
      .subscribe({
        next: (res) => {
          this.kannUnterrichtenResult.set(res);
          this.loading = false;
        },
        error: () => {
          this.kannUnterrichtenError.set(
            'Fehler bei der Abfrage. Prüfe Backend, Klasse und Raumname.'
          );
          this.loading = false;
        }
      });
  }
}

