import { Component, OnInit } from '@angular/core';
import { TeacherService } from './services/teacher.service';
import { Teacher } from './models/teacher.model';

@Component({
  selector: 'app-teachers',
  standalone: true,
  template: `
    <div class="teachers">
      <h1>Lehrerverwaltung</h1>
      <button (click)="addTeacher()">Lehrer hinzufügen</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Fächer</th>
            <th>Klassen</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let teacher of teachers">
            <td>{{ teacher.name }}</td>
            <td>{{ teacher.subjects.join(', ') }}</td>
            <td>{{ teacher.classes.join(', ') }}</td>
            <td>
              <button (click)="editTeacher(teacher)">Bearbeiten</button>
              <button (click)="deleteTeacher(teacher.id)">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .teachers {
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        background-color: #f4f4f4;
      }
    `
  ]
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];

  constructor(private teacherService: TeacherService) { }

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe(
      (data) => {
        this.teachers = data;
      },
      (error) => {
        console.error('Fehler beim Laden der Lehrerdaten:', error);
      }
    );
  }

  addTeacher() {
    console.log('Lehrer hinzufügen');
  }

  editTeacher(teacher: Teacher) {
    console.log('Lehrer bearbeiten', teacher);
  }

  deleteTeacher(id: number) {
    this.teacherService.deleteTeacher(id).subscribe(
      () => {
        console.log('Lehrer gelöscht');
        this.loadTeachers();
      },
      (error) => {
        console.error('Fehler beim Löschen des Lehrers:', error);
      }
    );
  }
}