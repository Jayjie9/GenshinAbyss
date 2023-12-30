using Microsoft.EntityFrameworkCore;

namespace GenshinAbyss.Entities
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<AbyssRecord> AbyssRecords { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<CharacterRecord> CharacterRecords { get; set; }
        public DbSet<Version> Version { get; set; }
        public DbSet<Talent> Talents { get; set; }
    }
}