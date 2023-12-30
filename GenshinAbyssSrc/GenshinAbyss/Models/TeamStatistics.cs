namespace GenshinAbyss.Models
{
    public class TeamStatistics
    {
        public IEnumerable<int> Team { get; set; } = null!;
        public int FirstHalf { get; set; }
        public int SecondHalf { get; set; }
        public double UsageRate { get; set; }
        public string Ratio { get; set; } = null!;
    }
}
