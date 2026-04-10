import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SchoolService } from './school.service';

@Component({
  selector: 'app-schueler-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">Neuen Schüler anlegen</h2>
        <p class="text-sm text-slate-400">
          Sendet die Daten direkt an den Endpoint
          <span class="font-mono text-sky-300">POST /api/schule/addSchueler</span>.
        </p>
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="space-y-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 shadow-sm"
      >
        <div class="grid gap-4 md:grid-cols-3">
          <label class="flex flex-col text-xs font-medium text-slate-300">
            Name
            <input
              formControlName="name"
              type="text"
              placeholder="z.B. Max Mustermann"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <label class="flex flex-col text-xs font-medium text-slate-300">
            Klasse
            <input
              formControlName="klasse"
              type="text"
              placeholder="z.B. 4AWI"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <label class="flex flex-col text-xs font-medium text-slate-300">
            Geburtstag
            <input
              formControlName="geburtstag"
              type="date"
              (change)="calculateAge()"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col text-xs font-medium text-slate-300">
            Alter (automatisch berechnet)
            <input
              type="number"
              [value]="calculatedAge"
              disabled
              class="mt-1 rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-400 cursor-not-allowed"
            />
          </label>

          <label class="flex flex-col text-xs font-medium text-slate-300">
            Geschlecht
            <select
              formControlName="geschlecht"
              class="mt-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Bitte wählen</option>
              <option value="männlich">männlich</option>
              <option value="weiblich">weiblich</option>
            </select>
          </label>
        </div>

        <div class="flex items-center justify-between gap-2">
          <p class="text-xs text-slate-500">
            Pflichtfelder: Name, Klasse, Geburtstag, Geschlecht.
          </p>
          <button
            type="submit"
            [disabled]="form.invalid || submitting"
            class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-800"
          >
            <span *ngIf="!submitting">Speichern</span>
            <span *ngIf="submitting">Speichere…</span>
          </button>
        </div>

        <p *ngIf="successMessage" class="text-xs text-emerald-400">
          {{ successMessage }}
        </p>
        <p *ngIf="errorMessage" class="text-xs text-rose-400">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  `
})
export class SchuelerFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly schoolService = inject(SchoolService);

  form = this.fb.group({
    name: ['', Validators.required],
    klasse: ['', Validators.required],
    geburtstag: ['', Validators.required],
    geschlecht: ['', Validators.required]
  });

  submitting = false;
  successMessage = '';
  errorMessage = '';
  calculatedAge = 0;

  calculateAge(): void {
    const geburtsdagValue = this.form.get('geburtstag')?.value;
    if (!geburtsdagValue) {
      this.calculatedAge = 0;
      return;
    }

    const birthDate = new Date(geburtsdagValue);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.calculatedAge = age;
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submitting = true;

    const value = this.form.value;

    this.schoolService
      .addSchueler({
        name: value.name ?? '',
        klasse: value.klasse ?? '',
        geburtstag: value.geburtstag ?? '',
        geschlecht: value.geschlecht ?? ''
      })
      .subscribe({
        next: (msg) => {
          const name = this.form.value.name ?? '';
          this.successMessage =
            msg || name
              ? `Schüler "${name}" wurde erfolgreich angelegt.`
              : 'Schüler wurde erfolgreich angelegt.';
          this.submitting = false;
          this.form.reset();
          this.calculatedAge = 0;
        },
        error: (err) => {
          this.errorMessage =
            err?.error ?? 'Fehler beim Speichern. Prüfe Backend und Daten.';
          this.submitting = false;
        }
      });
  }
}

