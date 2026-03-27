namespace Schulwebapplikation.Models
{
    public class Klassenraum
    {
        public int Id { get; set; } // Primary key for EF Core
        public string Name { get; set; }
        public float RaumInQm { get; set; }
        public int Plaetze { get; set; }
        public bool HasCynap { get; set; }

        public Klassenraum(string name, float raumInQm, int plaetze, bool hasCynap)
        {
            Name = name;
            RaumInQm = raumInQm;
            Plaetze = plaetze;
            HasCynap = hasCynap;
        }
    }
}