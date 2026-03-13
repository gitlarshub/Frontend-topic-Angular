import { Component } from '@angular/core';
import { SchuelerFormComponent } from './schueler-form.component';
import { SchuelerListComponent } from './schueler-list.component';

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [SchuelerFormComponent, SchuelerListComponent],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-slate-50">Students</h2>
        <p class="text-sm text-slate-400">
          Schüler anlegen, suchen und filtern.
        </p>
      </div>

      <section class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <app-schueler-form></app-schueler-form>
      </section>

      <section class="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        <app-schueler-list></app-schueler-list>
      </section>
    </div>
  `
})
export class StudentsPageComponent {}

