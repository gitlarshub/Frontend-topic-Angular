import { Component, OnInit } from '@angular/core';
import { ClassService } from './services/class.service';
import { Class } from './models/class.model';

@Component({
  selector: 'app-classes',
  standalone: true,
  template: `
    <div class="classes">
      <h1>Klassenverwaltung</h1>
      <button (click)="addClass()">Klasse erstellen</button>
      <table>
        <thead>
          <tr>
            <th>Klasse</th>
            <th>Klassenlehrer</th>
            <th>Schüler</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let classItem of classes">
            <td>{{ classItem.name }}</td>
            <td>{{ classItem.teacher }}</td>
            <td>{{ classItem.students.join(', ') }}</td>
            <td>
              <button (click)="editClass(classItem)">Bearbeiten</button>
              <button (click)="deleteClass(classItem.id)">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .classes {
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
export class ClassesComponent implements OnInit {
  classes: Class[] = [];

  constructor(private classService: ClassService) { }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getClasses().subscribe(
      (data) => {
        this.classes = data;
      },
      (error) => {
        console.error('Fehler beim Laden der Klassendaten:', error);
      }
    );
  }

  addClass() {
    console.log('Klasse erstellen');
  }

  editClass(classItem: Class) {
    console.log('Klasse bearbeiten', classItem);
  }

  deleteClass(id: number) {
    this.classService.deleteClass(id).subscribe(
      () => {
        console.log('Klasse gelöscht');
        this.loadClasses();
      },
      (error) => {
        console.error('Fehler beim Löschen der Klasse:', error);
      }
    );
  }
}