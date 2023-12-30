using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GenshinAbyss.Entities
{
    public class Version
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Ver { get; set; } = null!;
        public long StartDate { get; set; }
        public long EndDate { get; set; }
    }
}
