namespace Schulwebapplikation.Models
{
    public class Schueler : Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Klasse { get; set; }

        public int Alter
        {
            get
            {
                int alter = DateTime.Today.Year - Geburtstag.Year;
                if (Geburtstag.Date > DateTime.Today.AddYears(-alter)) alter--;
                return alter;
            }
            set { }
        }

        public Schueler(string name, string klasse, DateTime geburtstag, string geschlecht)
            : base(geburtstag, geschlecht)
        {
            Name = name;
            Klasse = klasse;
        }
    }
}