namespace WebApplication1
{
    public struct Client
    {
        public int id { get; set; } = 0;
        public string name { get; set; }
        public int tariff { get; set; }
        public string contacts { get; set; }
        public Client(int i=0,string n="",int t=0,string c="")
        {
            id = i;name = n;tariff= t; contacts = c;
        }
    }
    public struct Request
    {
        public int id { get; set; } = 0;
        public string stage { get; set; }
        public string company { get; set; }
        public string deadline { get; set; }
        public int cost { get; set; }
        public string areas { get; set; }
        public Request(int i=0,string s = "",string com = "",string d = "",int cos = 0,string a = "")
        {
            id = i;stage = s;company= com;deadline = d;cost = cos;areas = a;
        }
    }
}
