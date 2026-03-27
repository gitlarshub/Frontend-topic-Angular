using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Schulwebapplikation.Data;
using Schulwebapplikation.Models;

namespace Schulwebapplikation.Controllers
{
    [ApiController]
    [Route("api/klassenraum")]
    public class KlassenraumController : ControllerBase
    {
        private readonly DBContext _context;

        public KlassenraumController(DBContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddKlassenraum([FromBody] Klassenraum klassenraum)
        {
            if (klassenraum == null || string.IsNullOrEmpty(klassenraum.Name))
            {
                return BadRequest("Klassenraumdaten fehlen oder sind ungültig.");
            }

            try
            {
                _context.Klassenraeume.Add(klassenraum);
                await _context.SaveChangesAsync();
                return Ok("Klassenraum hinzugefügt!");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Fehler beim Hinzufügen: {ex.InnerException?.Message ?? ex.Message}");
            }
        }
    }
}