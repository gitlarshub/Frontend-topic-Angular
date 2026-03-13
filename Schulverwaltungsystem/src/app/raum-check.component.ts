import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService } from './school.service';

@Component({
  selector: 'app-raum-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">Raumkapazität prüfen</h2>
        <p class="text-sm text-slate-400">
          Verwendet den Endpoint
          <span class="font-mono text-sky-300">
            GET /api/schule/kannUnterrichten/&lt;klasse&gt;/&lt;raumName&gt;
          </span>
          und zeigt die Antwort als Text.
        </p>
      </div>

      <form
        (ngSubmit)="onCheck()"
        class="space-y-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 shadow-sm"
      >
        <div class="grid gap-4 md:grid-cols-2">
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
        </div>

        <div class="flex items-center justify-between gap-2">
          <p class="text-xs text-slate-500">
            Beide Felder müssen ausgefüllt sein.
          </p>
          <button
            type="submit"
            [disabled]="!klasse.trim() || !raumName.trim() || loading"
            class="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-800"
          >
            <span *ngIf="!loading">Prüfen</span>
            <span *ngIf="loading">Prüfe…</span>
          </button>
        </div>

        <p *ngIf="result" class="text-xs text-emerald-400">
          {{ result }}
        </p>
        <p *ngIf="errorMessage" class="text-xs text-rose-400">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  `
})
export class RaumCheckComponent {
  private readonly schoolService = inject(SchoolService);

  klasse = '';
  raumName = '';
  loading = false;
  result = '';
  errorMessage = '';

  onCheck(): void {
    if (!this.klasse.trim() || !this.raumName.trim() || this.loading) {
      return;
    }

    this.result = '';
    this.errorMessage = '';
    this.loading = true;

    this.schoolService
      .checkKannUnterrichten(this.klasse.trim(), this.raumName.trim())
      .subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage =
            'Fehler bei der Abfrage. Prüfe Backend, Klasse und Raumname.';
          this.loading = false;
        }
      });
  }
}

