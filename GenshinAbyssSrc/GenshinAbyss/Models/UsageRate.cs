namespace GenshinAbyss.Models
{
    public class UsageRate
    {
        public int Id { get; set; }
        public int PrevUsed { get; set; }
        public int PrevTotal { get; set; }
        public int CurrentUsed { get; set; }
        public int CurrentTotal { get; set; }
    }
}
