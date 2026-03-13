using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectSchool.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Schulen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schulen", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Klassenraeume",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SchuleId = table.Column<int>(type: "INTEGER", nullable: false),
                    RaumInQm = table.Column<float>(type: "REAL", nullable: false),
                    Plaetze = table.Column<int>(type: "INTEGER", nullable: false),
                    HasCynap = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Klassenraeume", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Klassenraeume_Schulen_SchuleId",
                        column: x => x.SchuleId,
                        principalTable: "Schulen",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Schueler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SchuleId = table.Column<int>(type: "INTEGER", nullable: false),
                    Klasse = table.Column<string>(type: "TEXT", nullable: false),
                    Alter = table.Column<int>(type: "INTEGER", nullable: false),
                    Geschlecht = table.Column<string>(type: "TEXT", nullable: false),
                    Geburtstag = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schueler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schueler_Schulen_SchuleId",
                        column: x => x.SchuleId,
                        principalTable: "Schulen",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KlassenraumSchueler",
                columns: table => new
                {
                    KlassenraumId = table.Column<int>(type: "INTEGER", nullable: false),
                    SchuelerImRaumId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KlassenraumSchueler", x => new { x.KlassenraumId, x.SchuelerImRaumId });
                    table.ForeignKey(
                        name: "FK_KlassenraumSchueler_Klassenraeume_KlassenraumId",
                        column: x => x.KlassenraumId,
                        principalTable: "Klassenraeume",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KlassenraumSchueler_Schueler_SchuelerImRaumId",
                        column: x => x.SchuelerImRaumId,
                        principalTable: "Schueler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Klassenraeume_SchuleId",
                table: "Klassenraeume",
                column: "SchuleId");

            migrationBuilder.CreateIndex(
                name: "IX_KlassenraumSchueler_SchuelerImRaumId",
                table: "KlassenraumSchueler",
                column: "SchuelerImRaumId");

            migrationBuilder.CreateIndex(
                name: "IX_Schueler_SchuleId",
                table: "Schueler",
                column: "SchuleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KlassenraumSchueler");

            migrationBuilder.DropTable(
                name: "Klassenraeume");

            migrationBuilder.DropTable(
                name: "Schueler");

            migrationBuilder.DropTable(
                name: "Schulen");
        }
    }
}
