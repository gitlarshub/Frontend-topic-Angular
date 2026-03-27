using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Schulwebapplikation.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Klassenraeume",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    RaumInQm = table.Column<float>(type: "REAL", nullable: false),
                    Plaetze = table.Column<int>(type: "INTEGER", nullable: false),
                    HasCynap = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Klassenraeume", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Schueler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Klasse = table.Column<string>(type: "TEXT", nullable: false),
                    Alter = table.Column<int>(type: "INTEGER", nullable: false),
                    Geschlecht = table.Column<string>(type: "TEXT", nullable: false),
                    Geburtstag = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schueler", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Klassenraeume_Name",
                table: "Klassenraeume",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Schueler_Name",
                table: "Schueler",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Klassenraeume");

            migrationBuilder.DropTable(
                name: "Schueler");
        }
    }
}
