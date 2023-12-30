using GenshinAbyss.Entities;
using Microsoft.AspNetCore.Mvc;

namespace GenshinAbyss.Controllers
{
    public class TestController(ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            //var firstHalfTeams = new List<List<int>>
            //{
            //    new() { 1, 34, 49, 65},
            //    new() { 2, 69, 59, 34},
            //    new() { 53, 21, 79, 6},
            //    new() { 67, 6, 49, 65},
            //    new() { 1, 34, 59, 3},
            //    new() { 1, 69, 71, 65},
            //    new() { 2, 69, 49, 6},
            //    new() { 58, 49, 65, 71},
            //    new() { 11, 49, 59, 65}
            //};
            //var secondHalfTeams = new List<List<int>>
            //{
            //    new() { 28, 36, 24, 72},
            //    new() { 3, 66, 24, 60},
            //    new() { 8, 14, 44, 46},
            //    new() { 8, 30, 33, 50},
            //    new() { 8, 57, 43, 38},
            //    new() { 8, 51, 52, 32},
            //    new() { 9, 38, 32, 44}
            //};
            //for (var uid = 100090001L; uid <= 100100000L; uid += 2)
            //{
            //    var abyssRecord1 = new AbyssRecord
            //    {
            //        Uid = uid.ToString(),
            //        UploadTime = 1598904000L + Random.Shared.Next(107827199)
            //    };
            //    var abyssRecord2 = new AbyssRecord
            //    {
            //        Uid = (uid + 1).ToString(),
            //        UploadTime = 1598904000L + Random.Shared.Next(107827199)
            //    };
            //    _dbContext.AbyssRecords.Add(abyssRecord1);
            //    _dbContext.AbyssRecords.Add(abyssRecord2);
            //    await _dbContext.SaveChangesAsync();
            //    var characterRecords11 = firstHalfTeams[Random.Shared.Next(9)].Select(x => new CharacterRecord
            //    {
            //        AbyssRecordId = abyssRecord1.Id,
            //        CharacterId = x,
            //        Part = CharacterRecord.Half.FirstHalf
            //    });
            //    var characterRecords12 = secondHalfTeams[Random.Shared.Next(7)].Select(x => new CharacterRecord
            //    {
            //        AbyssRecordId = abyssRecord1.Id,
            //        CharacterId = x,
            //        Part = CharacterRecord.Half.SecondHalf
            //    });
            //    var characterRecords21 = firstHalfTeams[Random.Shared.Next(9)].Select(x => new CharacterRecord
            //    {
            //        AbyssRecordId = abyssRecord2.Id,
            //        CharacterId = x,
            //        Part = CharacterRecord.Half.SecondHalf
            //    });
            //    var characterRecords22 = secondHalfTeams[Random.Shared.Next(7)].Select(x => new CharacterRecord
            //    {
            //        AbyssRecordId = abyssRecord2.Id,
            //        CharacterId = x,
            //        Part = CharacterRecord.Half.FirstHalf
            //    });
            //    _dbContext.CharacterRecords.AddRange([.. characterRecords11, .. characterRecords12, .. characterRecords21, .. characterRecords22]);
            //    await _dbContext.SaveChangesAsync();
            //}
            //var list = Enumerable.Range(1, 81).ToList();
            //for (var uid = 120005001L; uid <= 120010000L; uid++)
            //{
            //    var abyssRecord = new AbyssRecord
            //    {
            //        Uid = uid.ToString(),
            //        UploadTime = 1598904000L + Random.Shared.Next(107827199)
            //    };
            //    _dbContext.AbyssRecords.Add(abyssRecord);
            //    await _dbContext.SaveChangesAsync();
            //    var characterRecords = list.OrderBy(_ => Guid.NewGuid()).Take(8).Chunk(4);
            //    var characterRecords1 = characterRecords.ElementAt(0).Select(x => new CharacterRecord
            //    {
            //        AbyssRecordId = abyssRecord.Id,
            //        CharacterId = x,
            //        Part = CharacterRecord.Half.FirstHalf
            //    });
            //    var characterRecords2 = characterRecords.ElementAt(1).Select(x => new CharacterRecord
            //    {
            //        AbyssRecordId = abyssRecord.Id,
            //        CharacterId = x,
            //        Part = CharacterRecord.Half.SecondHalf
            //    });
            //    _dbContext.CharacterRecords.AddRange(characterRecords1);
            //    _dbContext.CharacterRecords.AddRange(characterRecords2);
            //    await _dbContext.SaveChangesAsync();
            //}
            await Task.Delay(100000);
            return Ok();
        }
    }
}
