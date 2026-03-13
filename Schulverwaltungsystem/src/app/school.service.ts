import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Schueler {
  id: number;
  schuleId: number;
  name: string;
  klasse: string;
  geburtstag: string;
  geschlecht: string;
  alter: number;
}

export interface CreateSchuelerPayload {
  // Wird vom Backend aktuell ignoriert, dient nur fürs Frontend
  name: string;
  klasse: string;
  geburtstag: string;
  geschlecht: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private readonly http = inject(HttpClient);

  // Passe die URL bei Bedarf an dein Profil/Port an (siehe launchSettings.json)
  private readonly baseUrl = 'https://localhost:7153/api/schule';

  getAllSchueler(): Observable<Schueler[]> {
    return this.http.get<Schueler[]>(`${this.baseUrl}/getAllSchueler`);
  }

  getSchuelerByKlasse(klasse: string): Observable<Schueler[]> {
    return this.http.get<Schueler[]>(`${this.baseUrl}/getSchuelerByKlasse/${encodeURIComponent(klasse)}`);
  }

  addSchueler(payload: CreateSchuelerPayload): Observable<string> {
    return this.http.post(`${this.baseUrl}/addSchueler`, payload, {
      responseType: 'text'
    });
  }

  checkKannUnterrichten(klasse: string, raumName: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/kannUnterrichten/${encodeURIComponent(klasse)}/${encodeURIComponent(raumName)}`, {
      responseType: 'text'
    });
  }
}

