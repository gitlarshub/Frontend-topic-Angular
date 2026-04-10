import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService, Schueler } from './school.service';

@Component({
  selector: 'app-schueler-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-slate-100">Schülerübersicht</h2>
          <p class="text-sm text-slate-400">
            Zeigt alle Schüler aus dem Backend. Optional nach Klasse filtern.
          </p>
        </div>

        <form (ngSubmit)="onFilter()" class="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label class="flex flex-col text-xs font-medium text-slate-300">
            Klasse
            <input
              [(ngModel)]="klasseFilter"
              name="klasse"
              type="text"
              placeholder="z.B. 4AWI"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <div class="flex gap-2">
            <button
              type="submit"
              class="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-500"
            >
              Filtern
            </button>
            <button
              type="button"
              (click)="loadAll()"
              class="inline-flex items-center rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
            >
              Alle laden
            </button>
          </div>
        </form>
      </div>

      <div
        class="rounded-lg border border-slate-700 bg-slate-900/60 shadow-sm"
      >
        <div class="border-b border-slate-700 px-3 py-2 text-xs text-slate-400">
          {{ schueler().length }} Schüler gefunden
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead class="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="border-b border-slate-700 px-3 py-2">ID</th>
                <th class="border-b border-slate-700 px-3 py-2">Name</th>
                <th class="border-b border-slate-700 px-3 py-2">Klasse</th>
                <th class="border-b border-slate-700 px-3 py-2">Geburtstag</th>
                <th class="border-b border-slate-700 px-3 py-2">Alter</th>
                <th class="border-b border-slate-700 px-3 py-2">Geschlecht</th>
                <th class="border-b border-slate-700 px-3 py-2">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let s of schueler(); trackBy: trackById"
                class="odd:bg-slate-900/40 even:bg-slate-900/10"
              >
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ s.id }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ s.name }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ s.klasse }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-300">
                  {{ s.geburtstag | date: 'dd.MM.yyyy' }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ s.alter }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-300">
                  {{ s.geschlecht }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs">
                  <button
                    (click)="onDelete(s.id)"
                    [disabled]="deleting"
                    class="rounded bg-rose-600 px-2 py-1 text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-800"
                  >
                    {{ deleting ? 'Löscht...' : 'Löschen' }}
                  </button>
                </td>
              </tr>
              <tr *ngIf="schueler().length === 0">
                <td
                  colspan="7"
                  class="px-3 py-4 text-center text-xs text-slate-500"
                >
                  Noch keine Schüler im System oder Filter ohne Ergebnis.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p *ngIf="errorMessage" class="text-xs text-rose-400">
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class SchuelerListComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);

  schueler = signal<Schueler[]>([]);
  klasseFilter = '';
  errorMessage = '';
  deleting = false;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.errorMessage = '';
    this.schoolService.getAllSchueler().subscribe({
      next: (result) => this.schueler.set(result),
      error: () => {
        this.errorMessage = 'Fehler beim Laden der Schülerliste (Backend erreichbar?).';
        this.schueler.set([]);
      }
    });
  }

  onFilter(): void {
    this.errorMessage = '';
    const trimmed = this.klasseFilter.trim();
    if (!trimmed) {
      this.loadAll();
      return;
    }

    this.schoolService.getSchuelerByKlasse(trimmed).subscribe({
      next: (result) => this.schueler.set(result),
      error: () => {
        this.errorMessage = 'Fehler beim Filtern nach Klasse.';
        this.schueler.set([]);
      }
    });
  }

  onDelete(schuelerID: number): void {
    if (!confirm('Möchtest du diesen Schüler wirklich löschen?')) {
      return;
    }

    this.deleting = true;
    this.errorMessage = '';

    this.schoolService.deleteSchueler(schuelerID).subscribe({
      next: () => {
        this.schueler.update(students =>
          students.filter(s => s.id !== schuelerID)
        );
        this.deleting = false;
      },
      error: (err) => {
        this.errorMessage = err?.error ?? 'Fehler beim Löschen des Schülers.';
        this.deleting = false;
      }
    });
  }

  trackById(_: number, item: Schueler): number {
    return item.id;
  }
}

