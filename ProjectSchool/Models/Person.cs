namespace ProjectSchool.Models
{
    public class Person
    {
        public int Id { get; set; }
        private string _geschlecht;

        public string Geschlecht
        {
            get => _geschlecht;
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

        // Parameterloser Konstruktor für Model-Binding / EF
        public Person()
        {
        }

        public Person(DateTime geburtstag, string geschlecht)
        {
            Geburtstag = geburtstag;
            Geschlecht = geschlecht;
        }
    }
}