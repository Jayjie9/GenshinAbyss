using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GenshinAbyss.Entities
{
    public class AbyssRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Uid { get; set; } = null!;
        public long UploadTime { get; set; }
    }
}
