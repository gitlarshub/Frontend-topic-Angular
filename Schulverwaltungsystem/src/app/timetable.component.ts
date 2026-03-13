import { Component } from '@angular/core';

@Component({
    selector: 'app-timetable',
    standalone: true,
    template: `
    <div class="timetable">
      <h1>Stundenplan</h1>
      <div class="week-view">
        <div class="day" *ngFor="let day of week">
          <h2>{{ day.name }}</h2>
          <ul>
            <li *ngFor="let lesson of day.lessons">
              {{ lesson.time }} - {{ lesson.subject }} ({{ lesson.teacher }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
    styles: [
        `
      .timetable {
        padding: 20px;
      }
      .week-view {
        display: flex;
        gap: 20px;
      }
      .day {
        flex: 1;
        background: #f9f9f9;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `
    ]
})
export class TimetableComponent {
    week = [
        {
            name: 'Montag', lessons: [
                { time: '08:00-08:45', subject: 'Mathematik', teacher: 'Herr Müller' },
                { time: '08:50-09:35', subject: 'Englisch', teacher: 'Frau Schmidt' }
            ]
        },
        {
            name: 'Dienstag', lessons: [
                { time: '08:00-08:45', subject: 'Physik', teacher: 'Herr Müller' },
                { time: '08:50-09:35', subject: 'Geschichte', teacher: 'Frau Schmidt' }
            ]
        }
        // Weitere Tage hier hinzufügen
    ];
}