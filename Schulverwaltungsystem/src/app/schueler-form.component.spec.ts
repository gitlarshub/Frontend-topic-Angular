import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SchuelerFormComponent } from './schueler-form.component';
import { SchoolService } from './school.service';
import { of, throwError } from 'rxjs';

describe('SchuelerFormComponent', () => {
    let component: SchuelerFormComponent;
    let fixture: ComponentFixture<SchuelerFormComponent>;
    let schoolService: jasmine.SpyObj<SchoolService>;

    beforeEach(async () => {
        const schoolServiceSpy = jasmine.createSpyObj('SchoolService', ['addSchueler']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, HttpClientTestingModule, SchuelerFormComponent],
            providers: [
                { provide: SchoolService, useValue: schoolServiceSpy }
            ]
        }).compileComponents();

        schoolService = TestBed.inject(SchoolService) as jasmine.SpyObj<SchoolService>;
        fixture = TestBed.createComponent(SchuelerFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
        expect(component.form.get('name')?.value).toBe('');
        expect(component.form.get('klasse')?.value).toBe('');
        expect(component.form.get('geburtstag')?.value).toBe('');
        expect(component.form.get('geschlecht')?.value).toBe('');
    });

    it('should calculate age correctly from birthdate', () => {
        const birthYear = new Date().getFullYear() - 18;
        const birthDate = `${birthYear}-05-15`;

        component.form.patchValue({ geburtstag: birthDate });
        component.calculateAge();

        expect(component.calculatedAge).toBe(18);
    });

    it('should show success message after adding student', (done) => {
        schoolService.addSchueler.and.returnValue(of('Schüler hinzugefügt'));

        component.form.patchValue({
            name: 'Max',
            klasse: '4AWI',
            geburtstag: '2006-05-15',
            geschlecht: 'männlich'
        });

        component.onSubmit();

        setTimeout(() => {
            expect(component.successMessage).toContain('Max');
            expect(component.submitting).toBe(false);
            done();
        }, 100);
    });

    it('should show error message when request fails', (done) => {
        schoolService.addSchueler.and.returnValue(
            throwError(() => ({ error: 'Datenbankfehler' }))
        );

        component.form.patchValue({
            name: 'Max',
            klasse: '4AWI',
            geburtstag: '2006-05-15',
            geschlecht: 'männlich'
        });

        component.onSubmit();

        setTimeout(() => {
            expect(component.errorMessage).toContain('Datenbankfehler');
            expect(component.submitting).toBe(false);
            done();
        }, 100);
    });

    it('should reset form after successful submission', (done) => {
        schoolService.addSchueler.and.returnValue(of('Erfolgreich'));

        component.form.patchValue({
            name: 'Max',
            klasse: '4AWI',
            geburtstag: '2006-05-15',
            geschlecht: 'männlich'
        });

        component.onSubmit();

        setTimeout(() => {
            expect(component.form.get('name')?.value).toBeNull();
            expect(component.calculatedAge).toBe(0);
            done();
        }, 100);
    });

    it('should not submit if form is invalid', () => {
        component.form.patchValue({
            name: 'Max'
            // Missing other required fields
        });

        component.onSubmit();

        expect(schoolService.addSchueler).not.toHaveBeenCalled();
    });

    it('should disable submit button while submitting', () => {
        component.submitting = true;
        fixture.detectChanges();

        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(true);
    });
});
