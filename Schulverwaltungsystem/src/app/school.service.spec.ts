import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchoolService } from './school.service';

describe('SchoolService', () => {
    let service: SchoolService;
    let httpMock: HttpTestingController;
    const baseUrl = 'http://localhost:5287';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SchoolService]
        });

        service = TestBed.inject(SchoolService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllSchueler', () => {
        it('should fetch all students', () => {
            const mockSchueler = [
                { id: 1, name: 'Max', klasse: '4AWI', geburtstag: '2006-05-15', alter: 19, geschlecht: 'männlich', schuleId: 1 },
                { id: 2, name: 'Anna', klasse: '4AWI', geburtstag: '2007-03-20', alter: 18, geschlecht: 'weiblich', schuleId: 1 }
            ];

            service.getAllSchueler().subscribe(result => {
                expect(result.length).toBe(2);
                expect(result[0].name).toBe('Max');
            });

            const req = httpMock.expectOne(`${baseUrl}/api/schueler/all`);
            expect(req.request.method).toBe('GET');
            req.flush(mockSchueler);
        });
    });

    describe('getSchuelerByKlasse', () => {
        it('should fetch students by class', () => {
            const mockSchueler = [
                { id: 1, name: 'Max', klasse: '4AWI', geburtstag: '2006-05-15', alter: 19, geschlecht: 'männlich', schuleId: 1 }
            ];

            service.getSchuelerByKlasse('4AWI').subscribe(result => {
                expect(result.length).toBe(1);
                expect(result[0].klasse).toBe('4AWI');
            });

            const req = httpMock.expectOne(`${baseUrl}/api/schueler/byKlasse/4AWI`);
            expect(req.request.method).toBe('GET');
            req.flush(mockSchueler);
        });

        it('should URL encode class names', () => {
            service.getSchuelerByKlasse('4A WI').subscribe();

            const req = httpMock.expectOne(`${baseUrl}/api/schueler/byKlasse/4A%20WI`);
            req.flush([]);
        });
    });

    describe('addSchueler', () => {
        it('should add a student', () => {
            const payload = {
                name: 'Max',
                klasse: '4AWI',
                geburtstag: '2006-05-15',
                geschlecht: 'männlich'
            };

            service.addSchueler(payload).subscribe(result => {
                expect(result).toBeTruthy();
            });

            const req = httpMock.expectOne(`${baseUrl}/api/schueler/add`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush('Schüler hinzugefügt!');
        });
    });

    describe('deleteSchueler', () => {
        it('should delete a student', () => {
            const schuelerID = 1;

            service.deleteSchueler(schuelerID).subscribe(result => {
                expect(result).toContain('gelöscht');
            });

            const req = httpMock.expectOne(`${baseUrl}/api/schueler/delete/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush('Schüler mit ID 1 wurde gelöscht.');
        });
    });

    describe('checkKannUnterrichten', () => {
        it('should check if a room can accommodate a class', () => {
            service.checkKannUnterrichten('4AWI', 'B204').subscribe(result => {
                expect(result).toContain('kann');
            });

            const req = httpMock.expectOne(
                `${baseUrl}/api/schule/analytics/kannUnterrichten/4AWI/B204`
            );
            expect(req.request.method).toBe('GET');
            req.flush('Ja, die Klasse kann unterrichtet werden.');
        });

        it('should URL encode parameters with special characters', () => {
            service.checkKannUnterrichten('4A WI', 'Raum 204').subscribe();

            const req = httpMock.expectOne(
                `${baseUrl}/api/schule/analytics/kannUnterrichten/4A%20WI/Raum%20204`
            );
            req.flush('');
        });
    });
});
