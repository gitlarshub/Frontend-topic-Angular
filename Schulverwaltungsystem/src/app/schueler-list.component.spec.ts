import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchuelerListComponent } from './schueler-list.component';
import { SchoolService, Schueler } from './school.service';
import { of, throwError } from 'rxjs';

describe('SchuelerListComponent', () => {
    let component: SchuelerListComponent;
    let fixture: ComponentFixture<SchuelerListComponent>;
    let schoolService: jasmine.SpyObj<SchoolService>;

    const mockSchueler: Schueler[] = [
        { id: 1, name: 'Max', klasse: '4AWI', geburtstag: '2006-05-15', alter: 18, geschlecht: 'männlich', schuleId: 1 },
        { id: 2, name: 'Anna', klasse: '4AWI', geburtstag: '2007-03-20', alter: 17, geschlecht: 'weiblich', schuleId: 1 }
    ];

    beforeEach(async () => {
        const schoolServiceSpy = jasmine.createSpyObj('SchoolService', [
            'getAllSchueler',
            'getSchuelerByKlasse',
            'deleteSchueler'
        ]);

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                HttpClientTestingModule,
                SchuelerListComponent
            ],
            providers: [
                { provide: SchoolService, useValue: schoolServiceSpy }
            ]
        }).compileComponents();

        schoolService = TestBed.inject(SchoolService) as jasmine.SpyObj<SchoolService>;
        fixture = TestBed.createComponent(SchuelerListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load all students on init', () => {
        schoolService.getAllSchueler.and.returnValue(of(mockSchueler));

        component.ngOnInit();

        expect(schoolService.getAllSchueler).toHaveBeenCalled();
        expect(component.schueler()).toEqual(mockSchueler);
    });

    it('should display error message when loading fails', () => {
        schoolService.getAllSchueler.and.returnValue(
            throwError(() => new Error('Network error'))
        );

        component.loadAll();

        expect(component.errorMessage).toContain('Backend');
        expect(component.schueler()).toEqual([]);
    });

    it('should filter students by class', () => {
        const filteredSchueler = [mockSchueler[0]];
        schoolService.getSchuelerByKlasse.and.returnValue(of(filteredSchueler));

        component.klasseFilter = '4AWI';
        component.onFilter();

        expect(schoolService.getSchuelerByKlasse).toHaveBeenCalledWith('4AWI');
        expect(component.schueler()).toEqual(filteredSchueler);
    });

    it('should reload all students when filter is empty', () => {
        schoolService.getAllSchueler.and.returnValue(of(mockSchueler));

        component.klasseFilter = '';
        component.onFilter();

        expect(schoolService.getAllSchueler).toHaveBeenCalled();
    });

    it('should delete student with confirmation', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        schoolService.deleteSchueler.and.returnValue(of('Gelöscht'));
        component.schueler.set(mockSchueler);

        component.onDelete(1);

        expect(schoolService.deleteSchueler).toHaveBeenCalledWith(1);
        expect(component.schueler()).toEqual([mockSchueler[1]]);
    });

    it('should not delete student when confirmation is cancelled', () => {
        spyOn(window, 'confirm').and.returnValue(false);

        component.onDelete(1);

        expect(schoolService.deleteSchueler).not.toHaveBeenCalled();
    });

    it('should show error message when deletion fails', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        schoolService.deleteSchueler.and.returnValue(
            throwError(() => ({ error: 'Löschfehler' }))
        );
        component.schueler.set(mockSchueler);

        component.onDelete(1);

        expect(component.errorMessage).toContain('Löschfehler');
        expect(component.schueler().length).toBe(2);
    });

    it('should track by id for performance', () => {
        const trackId = component.trackById(0, mockSchueler[0]);
        expect(trackId).toBe(1);
    });

    it('should display all students in table', () => {
        component.schueler.set(mockSchueler);
        fixture.detectChanges();

        const rows = fixture.nativeElement.querySelectorAll('table tbody tr');
        // 2 student rows + 0 empty rows = 2
        expect(rows.length).toBe(2);
    });

    it('should show empty state when no students', () => {
        component.schueler.set([]);
        fixture.detectChanges();

        const emptyRow = fixture.nativeElement.querySelector('tr td[colspan="7"]');
        expect(emptyRow).toBeTruthy();
    });
});
