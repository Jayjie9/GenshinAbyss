namespace GenshinAbyss.Models
{
    public class AbyssDetailRecord
    {
        public IEnumerable<int> FirstHalf { get; set; } = null!;
        public IEnumerable<int> SecondHalf { get; set; } = null!;
        public DateTime UploadTime { get; set; }
    }
}
