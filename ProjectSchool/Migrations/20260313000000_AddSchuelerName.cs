using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectSchool.Migrations
{
    /// <inheritdoc />
    public partial class AddSchuelerName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Schueler",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Schueler");
        }
    }
}

