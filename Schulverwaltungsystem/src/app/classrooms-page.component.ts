import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService } from './school.service';

interface Classroom {
  id?: number;
  name: string;
  raumInQm: number;
  plaetze: number;
  hasCynap: boolean;
}

@Component({
  selector: 'app-classrooms-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-slate-50">Classrooms</h2>
        <p class="text-sm text-slate-400">
          Klassenräume verwalten und durchsuchen.
        </p>
      </div>

      <section class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <form
          (ngSubmit)="onAdd()"
          class="grid gap-3 md:grid-cols-[2fr,1fr,1fr,auto]"
        >
          <label class="flex flex-col text-xs font-medium text-slate-300">
            Name
            <input
              [(ngModel)]="formName"
              name="name"
              type="text"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="z.B. B204"
            />
          </label>

          <label class="flex flex-col text-xs font-medium text-slate-300">
            Fläche (m²)
            <input
              [(ngModel)]="formRaumInQm"
              name="raumInQm"
              type="number"
              min="0"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <label class="flex flex-col text-xs font-medium text-slate-300">
            Plätze
            <input
              [(ngModel)]="formPlaetze"
              name="plaetze"
              type="number"
              min="0"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <div class="flex items-center gap-2 pt-5 text-xs text-slate-300">
            <label class="inline-flex items-center gap-1">
              <input
                type="checkbox"
                [(ngModel)]="formHasCynap"
                name="hasCynap"
                class="h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-sky-500 focus:ring-sky-500"
              />
              Cynap
            </label>
            <button
              type="submit"
              [disabled]="submitting || !formName.trim()"
              class="ml-auto inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-800"
            >
              <span *ngIf="!submitting">Hinzufügen</span>
              <span *ngIf="submitting">Speichere…</span>
            </button>
          </div>
        </form>

        <p *ngIf="successMessage" class="mt-2 text-xs text-emerald-400">
          {{ successMessage }}
        </p>
        <p *ngIf="errorMessage" class="mt-2 text-xs text-rose-400">
          {{ errorMessage }}
        </p>
      </section>

      <section class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <div
          class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <label class="flex flex-col text-xs font-medium text-slate-300">
            Suchen (Name)
            <input
              [(ngModel)]="search"
              name="search"
              type="text"
              placeholder="z.B. B"
              class="mt-1 max-w-xs rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <p class="text-xs text-slate-400">
            {{ filteredClassrooms().length }} Räume gefunden
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead class="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="border-b border-slate-700 px-3 py-2">Name</th>
                <th class="border-b border-slate-700 px-3 py-2">Fläche (m²)</th>
                <th class="border-b border-slate-700 px-3 py-2">Plätze</th>
                <th class="border-b border-slate-700 px-3 py-2">Cynap</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let r of filteredClassrooms(); trackBy: trackByName"
                class="odd:bg-slate-900/40 even:bg-slate-900/10"
              >
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ r.name }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ r.raumInQm }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ r.plaetze }}
                </td>
                <td class="border-b border-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  {{ r.hasCynap ? 'Ja' : 'Nein' }}
                </td>
              </tr>
              <tr *ngIf="filteredClassrooms().length === 0">
                <td
                  colspan="4"
                  class="px-3 py-4 text-center text-xs text-slate-500"
                >
                  Noch keine Räume angelegt oder Suchfilter ohne Ergebnis.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class ClassroomsPageComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly _classrooms = signal<Classroom[]>([]);

  formName = '';
  formRaumInQm = 0;
  formPlaetze = 0;
  formHasCynap = false;

  submitting = false;
  successMessage = '';
  errorMessage = '';
  search = '';

  readonly filteredClassrooms = computed(() => {
    const q = this.search.trim().toLowerCase();
    const list = this._classrooms();
    if (!q) {
      return list;
    }
    return list.filter((c) => c.name.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.loadClassrooms();
  }

  private loadClassrooms(): void {
    this.schoolService.getAllKlassenraeume().subscribe({
      next: (raeume) => {
        this._classrooms.set(raeume);
      },
      error: () => {
        this.errorMessage = 'Fehler beim Laden der Klassenräume.';
      }
    });
  }

  onAdd(): void {
    const name = this.formName.trim();
    if (!name || this.submitting) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submitting = true;

    const payload = {
      name,
      raumInQm: this.formRaumInQm || 0,
      plaetze: this.formPlaetze || 0,
      hasCynap: this.formHasCynap
    };

    this.schoolService.addKlassenraum(payload).subscribe({
      next: (msg) => {
        this.successMessage = msg || `Klassenraum "${name}" hinzugefügt!`;
        this.submitting = false;

        // Add to list
        this._classrooms.update((list) => [
          ...list,
          {
            name,
            raumInQm: this.formRaumInQm,
            plaetze: this.formPlaetze,
            hasCynap: this.formHasCynap
          }
        ]);

        // Clear form
        this.formName = '';
        this.formRaumInQm = 0;
        this.formPlaetze = 0;
        this.formHasCynap = false;
      },
      error: (err) => {
        this.errorMessage = err?.error ?? 'Fehler beim Speichern.';
        this.submitting = false;
      }
    });
  }

  trackByName(_: number, item: Classroom): string {
    return item.name;
  }
}

