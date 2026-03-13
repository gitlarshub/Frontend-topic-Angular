import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StudentsComponent } from './students.component';
import { StudentDetailComponent } from './student-detail.component';
import { TeachersComponent } from './teachers.component';
import { ClassesComponent } from './classes.component';
import { TimetableComponent } from './timetable.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'students', component: StudentsComponent },
    { path: 'students/:id', component: StudentDetailComponent },
    { path: 'teachers', component: TeachersComponent },
    { path: 'classes', component: ClassesComponent },
    { path: 'timetable', component: TimetableComponent },
];
