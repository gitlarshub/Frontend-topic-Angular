import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="cards">
        <div class="card">Anzahl Schüler: {{ studentCount }}</div>
        <div class="card">Anzahl Lehrer: {{ teacherCount }}</div>
        <div class="card">Anzahl Klassen: {{ classCount }}</div>
      </div>
      <div class="activities">
        <h2>Letzte Aktivitäten</h2>
        <ul>
          <li *ngFor="let activity of activities">{{ activity }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 20px;
      }
      .cards {
        display: flex;
        gap: 20px;
      }
      .card {
        background: #f4f4f4;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .activities {
        margin-top: 20px;
      }
    `
  ]
})
export class DashboardComponent {
  studentCount = 120;
  teacherCount = 15;
  classCount = 10;
  activities = ['Schüler hinzugefügt', 'Lehrer aktualisiert', 'Klasse erstellt'];
}