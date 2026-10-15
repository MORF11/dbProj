namespace WebApplication1
{
    public class WeatherForecast
    {
        public DateOnly Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string? Summary { get; set; }
    }
    public class Client
    {
        public int id { get; set; }
        public string name { get; set; }
        public int tariff { get; set; }
        public string contacts { get; set; }
    }
}
