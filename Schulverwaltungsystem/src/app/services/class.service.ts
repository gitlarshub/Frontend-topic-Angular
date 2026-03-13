import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from '../models/class.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClassService {
    private apiUrl = `${environment.apiUrl}/classes`;

    constructor(private http: HttpClient) { }

    getClasses(): Observable<Class[]> {
        return this.http.get<Class[]>(this.apiUrl);
    }

    addClass(classItem: Class): Observable<Class> {
        return this.http.post<Class>(this.apiUrl, classItem);
    }

    updateClass(id: number, classItem: Class): Observable<Class> {
        return this.http.put<Class>(`${this.apiUrl}/${id}`, classItem);
    }

    deleteClass(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}