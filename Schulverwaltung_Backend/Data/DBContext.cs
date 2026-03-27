using Microsoft.EntityFrameworkCore;
using Schulwebapplikation.Models;

namespace Schulwebapplikation.Data
{
    public class DBContext : DbContext
    {
        public DbSet<Schueler> Schueler { get; set; }
        public DbSet<Klassenraum> Klassenraeume { get; set; }

        public DBContext(DbContextOptions<DBContext> options) : base(options) { }

        private static readonly ILoggerFactory _loggerFactory =
            LoggerFactory.Create(builder =>
            {
                builder
                    .AddConsole()
                    .AddFilter((category, level) =>
                        category == DbLoggerCategory.Database.Command.Name &&
                        level == LogLevel.Information);
            });

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=schule.db")
                              .UseLoggerFactory(_loggerFactory);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Schueler>()
                .HasIndex(s => s.Name)
                .IsUnique();
            modelBuilder.Entity<Klassenraum>()
                .HasIndex(r => r.Name)
                .IsUnique();
        }
    }
}