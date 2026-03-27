using System.Linq;

namespace Schulwebapplikation.Models
{
    public class Schule
    {
        public List<Schueler> SchuelerList { get; set; } = new List<Schueler>();
        public List<Klassenraum> KlassenraumList { get; set; } = new List<Klassenraum>();

        public void AddSchuelerToSchule(Schueler schueler)
        {
            SchuelerList.Add(schueler);
        }

        public void AddKlassenraumToSchule(Klassenraum klassenraum)
        {
            KlassenraumList.Add(klassenraum);
        }

        public int AnzahlSchueler
        {
            get => SchuelerList.Count;
        }

        public int AnzahlKlassenRaum
        {
            get => KlassenraumList.Count;
        }

        public List<Klassenraum> AnzahlRauemeCynap()
        {
            return KlassenraumList.Where(r => r.HasCynap).ToList();
        }

        public float DurchschnittsalterSchueler()
        {
            if (!SchuelerList.Any()) return 0;
            return (float)SchuelerList.Average(s => s.Alter);
        }

        public double BerechneFrauenanteilInProzent(List<Schueler> schuelerListe, string klasse)
        {
            var schuelerInKlasse = schuelerListe.Where(s => s.Klasse == klasse).ToList();
            if (!schuelerInKlasse.Any()) return 0;

            int anzahlFrauen = schuelerInKlasse.Count(s => s.Geschlecht == "weiblich");
            return (double)anzahlFrauen / schuelerInKlasse.Count * 100;
        }

        public bool KannKlasseUnterrichten(string klasse, string raumName)
        {
            int schuelerInKlasse = SchuelerList.Count(s => s.Klasse == klasse);
            var raum = KlassenraumList.FirstOrDefault(r => r.Name == raumName);

            if (raum == null) return false;
            return raum.Plaetze >= schuelerInKlasse;
        }

        public string AnzahlSchuelerGeschlecht
        {
            get
            {
                int männlicheSchueler = SchuelerList.Count(s => s.Geschlecht == "männlich");
                int weiblicheSchueler = SchuelerList.Count(s => s.Geschlecht == "weiblich");
                return $"männliche: {männlicheSchueler} / weibliche: {weiblicheSchueler}";
            }
        }
    }
}