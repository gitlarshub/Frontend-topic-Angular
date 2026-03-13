document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:5107";

    // add schüler
    document.getElementById("addStudentForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const geburtstag = document.getElementById("geburtstag").value; 
        const geschlecht = document.getElementById("geschlecht").value;
        const klasse = document.getElementById("klasse").value;

        try {
            const response = await fetch(`${baseUrl}/api/schule/addSchueler`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    geburtstag: new Date(geburtstag).toISOString(),
                    geschlecht,
                    klasse
                })
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.text();
            alert(result);
        } catch (error) {
            alert(`Fehler: ${error.message}`);
        }
    });

    // Alle Schüler abrufen
    document.getElementById("getAllStudents").addEventListener("click", async () => {
        try {
            const response = await fetch(`${baseUrl}/api/schule/getAllSchueler`);
            if (!response.ok) {
                throw new Error("Fehler beim Abrufen der Schüler.");
            }
            const students = await response.json();
            const list = document.getElementById("studentsList");
            list.innerHTML = students.map(s => {
                const birthDate = new Date(s.geburtstag).toLocaleDateString("de-DE");
                return `<li>${s.klasse} - ${s.geschlecht} - Geburtstag: ${birthDate}</li>`;
            }).join("");
        } catch (error) {
            alert(`Fehler: ${error.message}`);
        }
    });

    // Schüler einer Klasse abrufen
    document.getElementById("getStudentsByClass").addEventListener("click", async () => {
        const klasse = document.getElementById("classFilter").value.trim();
        if (!klasse) {
            alert("Bitte eine Klasse eingeben.");
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/api/schule/getSchuelerByKlasse/${klasse}`);
            if (!response.ok) {
                throw new Error("Fehler beim Abrufen der Schüler.");
            }
            const students = await response.json();
            const list = document.getElementById("classStudentsList");
            list.innerHTML = students.map(s => {
                const birthDate = new Date(s.geburtstag).toLocaleDateString("de-DE");
                return `<li>${s.klasse} - ${s.geschlecht} - Geburtstag: ${birthDate}</li>`;
            }).join("");
        } catch (error) {
            alert(`Fehler: ${error.message}`);
        }
    });

    // Klassenraum prüfen
    document.getElementById("checkRoom").addEventListener("click", async () => {
        const klasse = document.getElementById("checkClass").value.trim();
        const raumName = document.getElementById("roomSize").value.trim();
        if (!klasse || !raumName) {
            alert("Bitte Klasse und Raumgröße eingeben.");
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/api/schule/kannUnterrichten/${klasse}/${raumName}`);
            if (!response.ok) {
                throw new Error("Fehler bei der Prüfung.");
            }
            const result = await response.text();
            document.getElementById("roomCheckResult").textContent = result;
        } catch (error) {
            alert(`Fehler: ${error.message}`);
        }
    });
});