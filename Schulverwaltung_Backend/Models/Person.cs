namespace Schulwebapplikation.Models
{
    public class Person
    {
        private string? _geschlecht; // Make nullable to avoid CS8618

        public string Geschlecht
        {
            get => _geschlecht ?? "unbekannt";
            set
            {
                if (value != "männlich" && value != "weiblich")
                {
                    Console.WriteLine("Ungültiges Geschlecht eingegeben!");
                    _geschlecht = "unbekannt";
                }
                else
                {
                    _geschlecht = value;
                }
            }
        }

        public DateTime Geburtstag { get; set; }

        public Person(DateTime geburtstag, string geschlecht)
        {
            Geburtstag = geburtstag;
            Geschlecht = geschlecht; // Setter handles validation
        }
    }
}