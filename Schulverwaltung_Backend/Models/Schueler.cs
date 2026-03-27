namespace Schulwebapplikation.Models
{
    public class Schueler : Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Klasse { get; set; }

        public int Alter
        {
            get => DateTime.Today.Year - Geburtstag.Year;
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