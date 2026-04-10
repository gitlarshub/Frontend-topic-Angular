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

  // Backend URLs - match your launchSettings.json configuration
  private readonly schuelerBaseUrl = 'http://localhost:5287/api/schueler';
  private readonly analyticsBaseUrl = 'http://localhost:5287/api/schule/analytics';

  getAllSchueler(): Observable<Schueler[]> {
    return this.http.get<Schueler[]>(`${this.schuelerBaseUrl}/all`);
  }

  getSchuelerByKlasse(klasse: string): Observable<Schueler[]> {
    return this.http.get<Schueler[]>(`${this.schuelerBaseUrl}/byKlasse/${encodeURIComponent(klasse)}`);
  }

  addSchueler(payload: CreateSchuelerPayload): Observable<string> {
    return this.http.post(`${this.schuelerBaseUrl}/add`, payload, {
      responseType: 'text'
    });
  }

  checkKannUnterrichten(klasse: string, raumName: string): Observable<string> {
    return this.http.get(`${this.analyticsBaseUrl}/kannUnterrichten/${encodeURIComponent(klasse)}/${encodeURIComponent(raumName)}`, {
      responseType: 'text'
    });
  }

  deleteSchueler(id: number): Observable<string> {
    return this.http.delete(`${this.schuelerBaseUrl}/delete/${id}`, {
      responseType: 'text'
    });
  }

  getAllKlassenraeume(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5287/api/klassenraum/all`);
  }

  addKlassenraum(payload: { name: string; raumInQm: number; plaetze: number; hasCynap: boolean }): Observable<string> {
    return this.http.post(`http://localhost:5287/api/klassenraum/add`, payload, {
      responseType: 'text'
    });
  }
}

