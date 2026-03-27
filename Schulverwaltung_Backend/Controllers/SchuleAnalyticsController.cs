using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Schulwebapplikation.Data;
using Schulwebapplikation.Models;

namespace Schulwebapplikation.Controllers
{
    [ApiController]
    [Route("api/schule/analytics")]
    public class SchuleAnalyticsController : ControllerBase
    {
        private readonly DBContext _context;

        public SchuleAnalyticsController(DBContext context)
        {
            _context = context;
        }

        [HttpGet("kannUnterrichten/{klasse}/{raumName}")]
        public async Task<IActionResult> KannUnterrichten(string klasse, string raumName)
        {
            var schuelerCount = await _context.Schueler
                .CountAsync(s => s.Klasse == klasse);
            var raum = await _context.Klassenraeume
                .FirstOrDefaultAsync(r => r.Name == raumName);

            if (raum == null)
            {
                return NotFound("Raum nicht gefunden.");
            }

            bool kannUnterrichten = raum.Plaetze >= schuelerCount;
            return Ok(kannUnterrichten ? "Ja, die Klasse kann unterrichtet werden." : "Nein, es gibt nicht genug Plätze.");
        }

        [HttpGet("durchschnittsalter")]
        public async Task<IActionResult> DurchschnittsalterSchueler()
        {
            var schueler = await _context.Schueler.ToListAsync();
            if (!schueler.Any())
            {
                return Ok(0);
            }
            double avgAge = schueler.Average(s => s.Alter);
            return Ok(avgAge);
        }

        [HttpGet("frauenanteil/{klasse}")]
        public async Task<IActionResult> BerechneFrauenanteilInProzent(string klasse)
        {
            var schuelerInKlasse = await _context.Schueler
                .Where(s => s.Klasse == klasse)
                .ToListAsync();
            if (!schuelerInKlasse.Any())
            {
                return Ok(0);
            }
            double frauenAnteil = (double)schuelerInKlasse.Count(s => s.Geschlecht == "weiblich") / schuelerInKlasse.Count * 100;
            return Ok(frauenAnteil);
        }
    }
}