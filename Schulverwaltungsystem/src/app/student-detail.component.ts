import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-student-detail',
    standalone: true,
    template: `
    <div class="student-detail" *ngIf="student">
      <h1>Details von {{ student.name }}</h1>
      <p><strong>Klasse:</strong> {{ student.class }}</p>
      <p><strong>Geburtsdatum:</strong> {{ student.birthdate }}</p>
      <p><strong>Email:</strong> {{ student.email }}</p>
      <button (click)="goBack()">Zurück</button>
    </div>
  `,
    styles: [
        `
      .student-detail {
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      button {
        margin-top: 20px;
      }
    `
    ]
})
export class StudentDetailComponent {
    @Input() student: any;

    goBack() {
        console.log('Zurück zur Schülerliste');
    }
}