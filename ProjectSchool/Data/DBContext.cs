using Microsoft.EntityFrameworkCore;
using ProjectSchool.Models;

namespace ProjectSchool.Data
{
    public class SchoolDbContext : DbContext
    {
        public DbSet<Schueler> Schueler { get; set; }
        public DbSet<Klassenraum> Klassenraeume { get; set; }
        public DbSet<Schule> Schulen { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=school.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Schueler>().ToTable("Schueler")
                .HasKey(s => s.Id); 

            modelBuilder.Entity<Klassenraum>().ToTable("Klassenraeume")
                .HasKey(k => k.Id);
            modelBuilder.Entity<Schule>().ToTable("Schulen")
                .HasKey(s => s.Id); 

            modelBuilder.Entity<Schule>()
                .HasMany(s => s.SchuelerList)
                .WithOne()
                .HasForeignKey("SchuleId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Schule>()
                .HasMany(s => s.KlassenraumList)
                .WithOne()
                .HasForeignKey("SchuleId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Klassenraum>()
                .HasMany(k => k.SchuelerImRaum)
                .WithMany()
                .UsingEntity(j => j.ToTable("KlassenraumSchueler"));
        }
    }
}