import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    template: `
    <nav class="sidebar">
      <ul>
        <li><a routerLink="/">Dashboard</a></li>
        <li><a routerLink="/students">Schüler</a></li>
        <li><a routerLink="/teachers">Lehrer</a></li>
        <li><a routerLink="/classes">Klassen</a></li>
        <li><a routerLink="/timetable">Stundenplan</a></li>
      </ul>
    </nav>
  `,
    styles: [
        `
      .sidebar {
        width: 200px;
        background: #333;
        color: #fff;
        height: 100vh;
        padding: 20px;
      }
      .sidebar ul {
        list-style: none;
        padding: 0;
      }
      .sidebar li {
        margin: 10px 0;
      }
      .sidebar a {
        color: #fff;
        text-decoration: none;
      }
      .sidebar a:hover {
        text-decoration: underline;
      }
    `
    ]
})
export class SidebarComponent { }