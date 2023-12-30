using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GenshinAbyss.Entities
{
    public class Character
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(64)]
        public string Name { get; set; } = null!;
        public int TalentId { get; set; }
        [ForeignKey(nameof(TalentId))]
        public Talent Talent { get; set; } = null!;
    }
}
