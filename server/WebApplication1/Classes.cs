namespace WebApplication1
{
    public struct Client
    {
        public int id { get; set; }
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
        public int id { get; set; }
        public string stage { get; set; }
        public string company { get; set; }
        public string deadline { get; set; }
        public int cost { get; set; }
        public string areas { get; set; }
        public string? executor { get; set; }
        public string? task { get; set; }
        public Request(int i=0,string s = "",string com = "",string d = "",int cos = 0,string a = "")
        {
            id = i;stage = s;company= com;deadline = d;cost = cos;areas = a;
            executor = null;task = null;
        }
    }
    public struct RequestChange
    {
        public int id { get; set; }
        public string stage { get; set; }
        public string? comment { get; set; }
    }
    public struct ExecutorChange
    {
        public int id { get; set; }
        public string executor { get; set; }
        public string? comment { get; set; }
    }
    public struct TaskChange
    {
        public int id { get; set; }
        public string task { get; set; }
        public string? comment { get; set; }
    }
    public class requesthistory
    {
        public int id { get; set; }
        public int requestId { get; set; }
        public string changeType { get; set; } = "";
        public string? oldValue { get; set; }
        public string? newValue { get; set; }
        public DateTime changedAt { get; set; }
        public string? comment { get; set; }
    }
    public struct RequestComment
    {
        public int id { get; set; }
        public int requestId { get; set; }
        public int? authorId { get; set; }
        public string text { get; set; }
        public DateTime createdAt { get; set; }
    }
    public struct CommentChange
    {
        public string text { get; set; }
    }
    public struct RequestAttachment
    {
        public int id { get; set; }
        public int requestId { get; set; }
        public string originalName { get; set; }
        public string contentType { get; set; }
        public long sizeBytes { get; set; }
        public DateTime createdAt { get; set; }
    }
    public class AttachmentUpload
    {
        public IFormFile? file { get; set; }
    }
}
