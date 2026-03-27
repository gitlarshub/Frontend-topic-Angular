import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('Schulverwaltung_Manuell');

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTest().subscribe(data => {
      console.log("Backend Antwort:", data);
    });
  }
}