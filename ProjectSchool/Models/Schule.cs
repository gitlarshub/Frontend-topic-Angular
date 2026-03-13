namespace ProjectSchool.Models
{
    public class Schule
    {
        public int Id { get; set; }
        public List<Schueler> SchuelerList { get; } = new List<Schueler>();
        public List<Klassenraum> KlassenraumList { get; } = new List<Klassenraum>();

        public void AddSchuelerToSchule(Schueler schueler)
        {
            if (schueler == null)
            {
                throw new InvalidDataException("Schüler darf nicht null sein.");
            }
            SchuelerList.Add(schueler);
        }

        public void AddKlassenraumToSchule(Klassenraum klassenraum)
        {
            if (klassenraum == null)
            {
                throw new InvalidDataException("Klassenraum darf nicht null sein.");
            }
            KlassenraumList.Add(klassenraum);
        }

        public List<Klassenraum> AnzahlRauemeCynap()
        {
            return KlassenraumList.Where(kr => kr.HasCynap).ToList();
        }

        public bool KannKlasseUnterrichten(string klasse, string raumName)
        {
            if (string.IsNullOrEmpty(klasse) || string.IsNullOrEmpty(raumName))
            {
                return false;
            }

            int schuelerInKlasse = SchuelerList.Count(s => s.Klasse == klasse);
            var raum = KlassenraumList.FirstOrDefault(kr => kr.Name == raumName);

            if (raum == null)
            {
                return false;
            }

            return raum.Plaetze >= schuelerInKlasse;
        }
    }
}