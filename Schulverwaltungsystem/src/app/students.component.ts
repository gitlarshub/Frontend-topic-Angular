import { Component, OnInit } from '@angular/core';
import { StudentService } from './services/student.service';
import { Student } from './models/student.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="students">
      <h1>Schülerverwaltung</h1>

      <!-- Add Student Form -->
      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
        <input formControlName="name" placeholder="Name" required />
        <input formControlName="class" placeholder="Klasse" required />
        <input formControlName="birthdate" type="date" required />
        <input formControlName="email" type="email" placeholder="Email" required />
        <button type="submit" [disabled]="studentForm.invalid">Hinzufügen</button>
      </form>

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
            <td *ngIf="editingStudent?.id !== student.id">{{ student.name }}</td>
            <td *ngIf="editingStudent?.id !== student.id">{{ student.class }}</td>
            <td *ngIf="editingStudent?.id !== student.id">{{ student.birthdate }}</td>
            <td *ngIf="editingStudent?.id !== student.id">{{ student.email }}</td>
            <td *ngIf="editingStudent?.id === student.id">
              <input [(ngModel)]="editingStudent.name" placeholder="Name" />
              <input [(ngModel)]="editingStudent.class" placeholder="Klasse" />
              <input [(ngModel)]="editingStudent.birthdate" type="date" />
              <input [(ngModel)]="editingStudent.email" type="email" />
            </td>
            <td>
              <button *ngIf="editingStudent?.id !== student.id" (click)="editStudent(student)">Bearbeiten</button>
              <button *ngIf="editingStudent?.id === student.id" (click)="saveStudent()">Speichern</button>
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
      form {
        margin-bottom: 20px;
      }
      form input {
        margin-right: 10px;
      }
    `
  ]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  editingStudent: Student | null = null;
  studentForm: FormGroup;

  constructor(private studentService: StudentService, private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      class: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

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

  onSubmit() {
    if (this.studentForm.valid) {
      this.studentService.addStudent(this.studentForm.value).subscribe(
        (newStudent) => {
          this.students.push(newStudent);
          this.studentForm.reset();
        },
        (error) => {
          console.error('Fehler beim Hinzufügen des Schülers:', error);
        }
      );
    }
  }

  editStudent(student: Student) {
    this.editingStudent = { ...student };
  }

  saveStudent() {
    if (this.editingStudent) {
      this.studentService.updateStudent(this.editingStudent.id, this.editingStudent).subscribe(
        () => {
          const index = this.students.findIndex(s => s.id === this.editingStudent!.id);
          if (index !== -1 && this.editingStudent) {
            this.students[index] = this.editingStudent;
          }
          this.editingStudent = null;
        },
        (error) => {
          console.error('Fehler beim Aktualisieren des Schülers:', error);
        }
      );
    }
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(
      () => {
        this.students = this.students.filter(student => student.id !== id);
      },
      (error) => {
        console.error('Fehler beim Löschen des Schülers:', error);
      }
    );
  }
}