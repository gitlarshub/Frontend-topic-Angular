namespace ProjectSchool.Models
{
    public class Schueler : Person
    {
        public string Name { get; set; } = string.Empty;
        public int SchuleId { get; set; }
        public string Klasse { get; set; }

        public int Alter
        {
            get
            {
                int alter = DateTime.Today.Year - Geburtstag.Year;
                return alter;
            }
            set { }
        }

        // Parameterloser Konstruktor für Model-Binding / EF
        public Schueler()
        {
        }

        public Schueler(string klasse, DateTime geburtstag, string geschlecht) : base(geburtstag, geschlecht)
        {
            Klasse = klasse;
        }
    }
}