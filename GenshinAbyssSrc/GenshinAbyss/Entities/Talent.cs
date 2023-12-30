using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GenshinAbyss.Entities
{
    public class Talent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DayOfTheWeek Days { get; set; }
        public enum DayOfTheWeek
        {
            Monday,
            Tuesday,
            Wednesday
        }
    }
}
