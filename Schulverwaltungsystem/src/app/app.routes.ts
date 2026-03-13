import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StudentsPageComponent } from './students-page.component';
import { ClassroomsPageComponent } from './classrooms-page.component';
import { AnalyticsPageComponent } from './analytics-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'students',
    component: StudentsPageComponent
  },
  {
    path: 'classrooms',
    component: ClassroomsPageComponent
  },
  {
    path: 'analytics',
    component: AnalyticsPageComponent
  }
];
