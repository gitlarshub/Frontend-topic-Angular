import { Component, OnInit } from '@angular/core';
import { StudentService } from './services/student.service';
import { Student } from './models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  template: `
    <div class="students">
      <h1>Schülerverwaltung</h1>
      <button (click)="addStudent()">Schüler hinzufügen</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Klasse</th>
            <th>Geburtsdatum</th>
            <th>Email</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let student of students">
            <td>{{ student.name }}</td>
            <td>{{ student.class }}</td>
            <td>{{ student.birthdate }}</td>
            <td>{{ student.email }}</td>
            <td>
              <button (click)="editStudent(student)">Bearbeiten</button>
              <button (click)="deleteStudent(student.id)">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .students {
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
export class StudentsComponent implements OnInit {
  constructor(private studentService: StudentService) { }

  students: Student[] = [];

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(
      (data) => {
        this.students = data;
      },
      (error) => {
        console.error('Fehler beim Laden der Schülerdaten:', error);
      }
    );
  }

  addStudent() {
    console.log('Schüler hinzufügen');
  }

  editStudent(student: Student) {
    console.log('Schüler bearbeiten', student);
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(
      () => {
        console.log('Schüler gelöscht');
        this.loadStudents();
      },
      (error) => {
        console.error('Fehler beim Löschen des Schülers:', error);
      }
    );
  }
}