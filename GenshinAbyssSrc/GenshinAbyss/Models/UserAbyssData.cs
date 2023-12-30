namespace GenshinAbyss.Models
{
    public class UserAbyssData
    {
        public string Uid { get; set; } = null!;
        public List<int> FirstHalf { get; set; } = null!;
        public List<int> SecondHalf { get; set; } = null!;
        public bool ForcedOverwrite { get; set; }
    }
}