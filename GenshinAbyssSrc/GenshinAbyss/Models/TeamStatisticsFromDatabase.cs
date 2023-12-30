namespace GenshinAbyss.Models
{
    public class TeamStatisticsFromDatabase
    {
        public string Team { get; set; } = null!;
        public int FirstHalf { get; set; }
        public int SecondHalf { get; set; }
    }
}