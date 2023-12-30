using GenshinAbyss.Entities;
using GenshinAbyss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GenshinAbyss.Controllers
{
    public class MetaDataSeedController(ApplicationDbContext dbContext, ILogger<MetaDataSeedController> logger) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly ILogger<MetaDataSeedController> _logger = logger;

        [HttpPost("starrail/meta/character")]
        public async Task<IActionResult> PostCharacterAsync([FromForm] string key, [FromForm] string characterName, [FromForm] int talentId)
        {
            if (key != "Genshin")
            {
                return Forbid();
            }
            await _dbContext.Database.ExecuteSqlAsync($"insert into characters (Name, TalentId) values ({characterName}, {talentId})");
            return Ok();
        }

        [HttpGet("starrail/meta/the_day_of_the_week")]
        public IActionResult GetTalentTheDayOfTheWeek()
        {
            var dayOfTheWeek = new Dictionary<int, string>
            {
                { 0,"周一/周四/周日" },
                { 1,"周二/周五/周日" },
                { 2,"周三/周六/周日" }
            };
            return Ok(dayOfTheWeek);
        }

        [HttpGet("starrail/meta/talents")]
        public IActionResult GetTalents()
        {
            var talents = _dbContext.Database.SqlQuery<Talent>($"select * from talents;").ToList();
            return Ok(new { talents });
        }

        [HttpPost("starrail/meta/talent")]
        public async Task<IActionResult> PostTalentAsync([FromForm] string key, [FromForm] string talentName, [FromForm] int days)
        {
            if (key != "Genshin")
            {
                return Forbid();
            }
            await _dbContext.Database.ExecuteSqlAsync($"insert into talents (name, days) values ({talentName},{days})");
            return Ok();
        }
    }
}
