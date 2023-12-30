using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GenshinAbyss.Entities
{
    public class CharacterRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int CharacterId { get; set; }
        [ForeignKey(nameof(CharacterId))]
        public Character Character { get; set; } = null!;
        [Required]
        public int AbyssRecordId { get; set; }
        [ForeignKey(nameof(AbyssRecordId))]
        public AbyssRecord AbyssRecord { get; set; } = null!;
        public Half Part { get; set; }
        public enum Half
        {
            FirstHalf,
            SecondHalf
        }
    }
}
