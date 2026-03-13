using Microsoft.AspNetCore.Mvc;
using ProjectSchool.Models;
using ProjectSchool.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectSchool.Controllers
{
    [ApiController]
    [Route("api/schule")]
    public class SchoolController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public SchoolController(SchoolDbContext context)
        {
            _context = context;
            // Ensure we have a school
            if (!_context.Schulen.Any())
            {
                _context.Schulen.Add(new Schule());
                _context.SaveChanges();
            }
        }

        [HttpPost("addSchueler")]
        public IActionResult AddSchueler([FromBody] Schueler schueler)
        {
            if (schueler == null)
            {
                return BadRequest("Schülerdaten fehlen.");
            }
            try
            {
                var schule = _context.Schulen.First();
                schule.AddSchuelerToSchule(schueler);
                _context.Schueler.Add(schueler);
                _context.SaveChanges();
                return Ok("Schüler hinzugefügt!");
            }
            catch (InvalidDataException ex)
            {
                return StatusCode(400, $"Falsche Daten eingegeben: {ex.Message}");
            }
        }

        [HttpGet("getAllSchueler")]
        public IActionResult GetAllSchueler()
        {
            var schule = _context.Schulen.First();
            return Ok(_context.Schueler.ToList());
        }

        [HttpGet("getSchuelerByKlasse/{klasse}")]
        public IActionResult GetSchuelerByKlasse(string klasse)
        {
            var schuelerInKlasse = _context.Schueler
                .Where(s => s.Klasse == klasse)
                .ToList();
            return Ok(schuelerInKlasse);
        }

        [HttpGet("kannUnterrichten/{klasse}/{raumName}")]
        public IActionResult KannUnterrichten(string klasse, string raumName)
        {
            var schule = _context.Schulen.First();
            bool kannUnterrichten = schule.KannKlasseUnterrichten(klasse, raumName);
            return Ok(kannUnterrichten ? "Ja, die Klasse kann unterrichtet werden." : "Nein, es gibt nicht genug Plätze.");
        }
    }
}