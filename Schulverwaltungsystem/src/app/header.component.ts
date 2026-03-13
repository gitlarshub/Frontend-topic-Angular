import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    standalone: true,
    template: `
    <header class="header">
      <h1>Schulverwaltungssystem</h1>
    </header>
  `,
    styles: [
        `
      .header {
        background: #0078d7;
        color: #fff;
        padding: 10px 20px;
        text-align: center;
      }
    `
    ]
})
export class HeaderComponent { }