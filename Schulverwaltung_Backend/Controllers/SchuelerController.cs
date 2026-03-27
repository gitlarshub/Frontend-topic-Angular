using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Schulwebapplikation.Data;
using Schulwebapplikation.Models;

namespace Schulwebapplikation.Controllers
{
    [ApiController]
    [Route("api/schueler")]
    public class SchuelerController : ControllerBase
    {
        private readonly DBContext _context;

        public SchuelerController(DBContext context)
        {   
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddSchueler([FromBody] Schueler schueler)
        {
            if (schueler == null || string.IsNullOrEmpty(schueler.Name) || string.IsNullOrEmpty(schueler.Klasse))
            {
                return BadRequest("Schülerdaten fehlen oder sind ungültig.");
            }

            try
            {
                _context.Schueler.Add(schueler);
                await _context.SaveChangesAsync();
                return Ok("Schüler hinzugefügt!");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Fehler beim Hinzufügen: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllSchueler()
        {
            var schueler = await _context.Schueler.ToListAsync();
            return Ok(schueler);
        }

        [HttpGet("byKlasse/{klasse}")]
        public async Task<IActionResult> GetSchuelerByKlasse(string klasse)
        {
            var schuelerInKlasse = await _context.Schueler
                .Where(s => s.Klasse == klasse)
                .ToListAsync();
            return Ok(schuelerInKlasse);
        }
    }
}