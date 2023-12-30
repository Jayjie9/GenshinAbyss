using GenshinAbyss.Entities;
using GenshinAbyss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using Version = GenshinAbyss.Entities.Version;

namespace GenshinAbyss.Controllers
{
    public class AbyssController(ApplicationDbContext dbContext, ILogger<AbyssController> logger) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly ILogger<AbyssController> _logger = logger;

        [HttpGet("starrail/characters")]
        public async Task<IActionResult> GetCharactersAsync()
        {
            var characters = await _dbContext.Database.SqlQuery<CharacterModel>($"select id, name from characters;").ToListAsync().ConfigureAwait(false);
            return Ok(new { characters });
        }

        [HttpGet("starrail/version")]
        public IActionResult GetVersion()
        {
            var versions = _dbContext.Database.SqlQuery<Version>($"select * from version;")
                .ToList()
                .Select(x => new
                {
                    x.Id,
                    x.Ver,
                    StartDate = DateTimeOffset.FromUnixTimeSeconds(x.StartDate),
                    EndDate = DateTimeOffset.FromUnixTimeSeconds(x.EndDate)
                });
            var currentVersion = versions.Where(x => x.StartDate < DateTime.Now && x.EndDate > DateTime.Now).Select(x => x.Id).FirstOrDefault();
            return Ok(new { currentVersion, versions });
        }

        [HttpGet("starrail/today_talent_materials")]
        public IActionResult GetTodayTalentMaterials()
        {
            var (today, tomorrow) = DateTime.Now.DayOfWeek switch
            {
                DayOfWeek.Sunday => ((Talent.DayOfTheWeek)(-1), Talent.DayOfTheWeek.Monday),
                DayOfWeek.Monday or DayOfWeek.Thursday => (Talent.DayOfTheWeek.Monday, Talent.DayOfTheWeek.Tuesday),
                DayOfWeek.Tuesday or DayOfWeek.Friday => (Talent.DayOfTheWeek.Tuesday, Talent.DayOfTheWeek.Wednesday),
                DayOfWeek.Wednesday => (Talent.DayOfTheWeek.Wednesday, Talent.DayOfTheWeek.Monday),
                DayOfWeek.Saturday => (Talent.DayOfTheWeek.Wednesday, (Talent.DayOfTheWeek)(-1)),
                _ => throw new NotImplementedException()
            };
            var todayMaterials = _dbContext.Database.SqlQuery<TalentModel>($"""
                select characters.id as CharacterId, talents.name as TalentName
                    from characters join talents on characters.talentid = talents.id
                    where talents.days = {today} or -1 = {today}
                """).ToList()
                .GroupBy(x => x.TalentName)
                .Select(x => new
                {
                    TalentMaterial = x.Key,
                    CharacterId = x.Select(x => x.CharacterId)
                });
            var tomorrowMaterials = _dbContext.Database.SqlQuery<TalentModel>($"""
                select characters.id as CharacterId, talents.name as TalentName
                    from characters join talents on characters.talentid = talents.id
                    where talents.days = {tomorrow} or -1 = {tomorrow}
                """).ToList()
                .GroupBy(x => x.TalentName)
                .Select(x => new
                {
                    TalentMaterial = x.Key,
                    CharacterId = x.Select(x => x.CharacterId)
                });
            return Ok(new { todayMaterials, tomorrowMaterials });
        }

        [HttpPost("starrail/abyss")]
        public async Task<IActionResult> PostAbyssDataAsync([FromBody] UserAbyssData abyssData)
        {
            var time = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var currentVersionId = _dbContext.Database.SqlQuery<int>($"""
                select id from Version where {time} > StartDate and {time} < EndDate
                """).ToList().SingleOrDefault();
            var overWriteCheck = _dbContext.Database.SqlQuery<AbyssRecord>($"""
                select * from abyssrecords where
                    Uid = {abyssData.Uid}
                    and UploadTime > (select any_value(StartDate) from Version where Id = {currentVersionId})
                    and UploadTime < (select any_value(EndDate) from Version where Id = {currentVersionId})
                """).ToList().SingleOrDefault();
            var id = 0;
            if (overWriteCheck is not null)
            {
                if (!abyssData.ForcedOverwrite)
                {
                    return Ok(new { Success = false, msg = "旅行者已经上传过这期深渊并且选择了不强制覆盖之前记录哦~" });
                }
                else
                {
                    id = overWriteCheck.Id;
                    await _dbContext.Database.ExecuteSqlAsync($"update abyssrecords set uploadtime = {time} where id = {id}");
                    await _dbContext.Database.ExecuteSqlAsync($"delete from characterrecords where AbyssRecordId = {id}");
                }
            }
            else
            {
                await _dbContext.Database.ExecuteSqlAsync($"insert into abyssrecords (uid,uploadtime) values({abyssData.Uid},{time})");
                id = _dbContext.Database.SqlQuery<int>($"select id from abyssrecords where uid={abyssData.Uid} and uploadtime={time}").ToList().Single();
            }
            abyssData.FirstHalf.ForEach(x =>
                _dbContext.Database.ExecuteSql($"insert into characterrecords (CharacterId,AbyssRecordId,Part) values ({x},{id},{CharacterRecord.Half.FirstHalf})"));
            abyssData.SecondHalf.ForEach(x =>
                _dbContext.Database.ExecuteSql($"insert into characterrecords (CharacterId,AbyssRecordId,Part) values ({x},{id},{CharacterRecord.Half.SecondHalf})"));
            return Ok();
        }

        [HttpGet("starrail/team_rank/{version}")]
        public IActionResult GetTeamRank([FromQuery] int characterId, [FromRoute] string version)
        {
            var teamStatisticsFromDatabase = _dbContext.Database.SqlQuery<TeamStatisticsFromDatabase>($"""
                    select team, count(part = 0 or null) as firstHalf, count(part = 1 or null) as secondHalf from 
                    	(select abyssrecordid, part, group_concat(characterid order by characterid asc separator ',') as team 
                        	from characterrecords where (abyssrecordid, part) in
                            		(select abyssrecordid, part from characterrecords
                                 	where characterid = {characterId} or -1 = {characterId})
                      		and abyssrecordid in
                      			(select Id from AbyssRecords where
                                  	UploadTime > (select any_value(StartDate) from Version where Ver = {version})
                                 	and UploadTime < (select any_value(EndDate) from Version where Ver = {version}))
                         	group by abyssrecordid, part) 
                     as groups group by team;
                    """).ToList();
            var teamStatistics = teamStatisticsFromDatabase.Select(x => new TeamStatistics
            {
                Team = x.Team.Split(',').Select(x => Convert.ToInt32(x)),
                FirstHalf = x.FirstHalf,
                SecondHalf = x.SecondHalf,
                UsageRate = (characterId == -1 ? 2 : 1) * (x.FirstHalf + x.SecondHalf) / (double)teamStatisticsFromDatabase.Sum(x => x.FirstHalf + x.SecondHalf),
                Ratio = $"{(float)x.FirstHalf / (x.FirstHalf + x.SecondHalf) * 100:F0}:{(float)x.SecondHalf / (x.FirstHalf + x.SecondHalf) * 100:F0}"
            }).OrderByDescending(x => x.UsageRate);
            return Ok(new { teamStatistics });
        }

        [HttpGet("starrail/uploadHisory")]
        public IActionResult GetUploadHistory([FromQuery] string uid)
        {
            var uploadHistory = _dbContext.Database.SqlQuery<AbyssDetailRecordFromDatabase>($"""
                select firstHalf, secondHalf, uploadtime from(
                    select abyssrecords.id,
                        abyssrecords.uploadtime,
                        group_concat(characterrecords.characterid order by characterrecords.characterid asc separator ',') as firstHalf
                        from abyssrecords join characterrecords on
                            abyssrecords.id = characterrecords.abyssrecordid
                        where abyssrecords.uid = {uid} and characterrecords.part = 0
                        group by abyssrecords.id, abyssrecords.uploadtime
                	) as firstHalfTable
                    join(
                        select abyssrecords.id,
                            group_concat(characterrecords.characterid order by characterrecords.characterid asc separator ',') as secondHalf
                            from abyssrecords join characterrecords on
                                abyssrecords.id = characterrecords.abyssrecordid
                            where abyssrecords.uid = {uid} and characterrecords.part = 1
                            group by abyssrecords.id
                    ) as secondHalfTable using (id);
                """).ToList()
                .Select(x => new AbyssDetailRecord
                {
                    FirstHalf = x.FirstHalf.Split(',').Select(x => Convert.ToInt32(x)),
                    SecondHalf = x.SecondHalf.Split(',').Select(x => Convert.ToInt32(x)),
                    UploadTime = DateTimeOffset.FromUnixTimeSeconds(x.UploadTime).LocalDateTime
                });
            return Ok(new { uploadHistory });
        }

        [HttpGet("starrail/usagerate/{version}")]
        public IActionResult GetUsageRate([FromRoute] string version)
        {
            var versionDateTime = _dbContext.Database.SqlQuery<VersionDateTime>($"""
                select * from (
                    select 1 as _, StartDate as PrevVersionStartDate, EndDate as PrevVersionEndDate from version where EndDate < 
                        (select any_value(StartDate) from version where Ver = {version}) order by EndDate desc limit 1) as PrevVersion
                join (
                    select 1 as _, StartDate as CurrentVersionStartDate, EndDate as CurrentVersionEndDate from version
                        where Ver = {version}
                ) as CurrentVersion using(_);
                """)
                .ToList().SingleOrDefault() 
                ?? new VersionDateTime
                {
                    CurrentVersionStartDate = 1598904000,
                    CurrentVersionEndDate = 1609444799
                };
            var usageRates = _dbContext.Database.SqlQuery<UsageRate>($"""
                select characters.id,
                	(select count(*) from CharacterRecords where CharacterId = characters.id and abyssrecordid in
                     	(select Id from AbyssRecords where
                        	UploadTime > {versionDateTime.CurrentVersionStartDate}
                            and UploadTime < {versionDateTime.CurrentVersionEndDate}))
                	as CurrentUsed,
                	(select count(*) from AbyssRecords where
                        	UploadTime > {versionDateTime.CurrentVersionStartDate}
                            and UploadTime < {versionDateTime.CurrentVersionEndDate})
                    as CurrentTotal,
                    (select count(*) from CharacterRecords where CharacterId = characters.id and abyssrecordid in
                     	(select Id from AbyssRecords where
                        	UploadTime > {versionDateTime.PrevVersionStartDate}
                            and UploadTime < {versionDateTime.PrevVersionEndDate}))
                	as PrevUsed,
                	(select count(*) from AbyssRecords where
                        	UploadTime > {versionDateTime.PrevVersionStartDate}
                            and UploadTime < {versionDateTime.PrevVersionEndDate})
                    as PrevTotal
                from characters;
                """)
                .ToList()
                .GroupBy(x => x.CurrentTotal)
                .Select(x => new
                {
                    CurrentTotal = x.Key,
                    PrevTotal = x.Select(x => x.PrevTotal).FirstOrDefault(),
                    Data = x.Select(x => new
                    {
                        CharacterId = x.Id,
                        x.PrevUsed,
                        PrevRate = x.PrevTotal != 0 ? ((double)x.PrevUsed / x.PrevTotal) : 0,
                        x.CurrentUsed,
                        CurrentRate = x.CurrentTotal != 0 ? ((double)x.CurrentUsed / x.CurrentTotal) : 0,
                        RateOfChange = (x.CurrentTotal != 0 ? ((double)x.CurrentUsed / x.CurrentTotal) : 0) - (x.PrevTotal != 0 ? ((double)x.PrevUsed / x.PrevTotal) : 0)
                    }).OrderByDescending(x => x.CurrentRate)
                })
                .FirstOrDefault();
            return Ok(new { usageRates });
        }
    }
}
