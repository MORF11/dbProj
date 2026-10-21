using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;
namespace WebApplication1
{
    public class ado
    {
        private string connstr = "Server=localhost;Database=test;Trusted_Connection=False;Integrated Security=True;TrustServerCertificate=True;";
        SqlConnection conn;

        private Dictionary<string, string> queries;
        public ado()
        {
            conn = new SqlConnection(connstr);
            queries = new Dictionary<string, string>()
            {
                { "getcl", "SELECT * FROM Clients WHERE id = @id" },
                { "postcl", "INSERT INTO Clients (clientsName, tariff, contacts) VALUES (@name,@tariff,@contacts)" }
            };
        }
        async public Task<Client?> getcl(int id)
        {
            await conn.OpenAsync();
            Client q = new Client();
            var com =  new SqlCommand(queries["getcl"], conn);
            com.Parameters.AddWithValue("@id",id);
            using (SqlDataReader reader = await com.ExecuteReaderAsync())
            {
                while (reader.Read())
                {
                    q.id = int.Parse($"{reader["id"]}");
                    q.name = $"{reader["clientsName"]}";
                    q.tariff = int.Parse($"{reader["tariff"]}");
                    q.contacts = $"{reader["contacts"]}";
                }
            }
            await conn.CloseAsync();
            if (q.name == null)
            {
                return null;
            }
            return q;
        }
        async public Task<IActionResult?> postcl(string name, int tariff, string contacts)
        {
            await conn.OpenAsync();
            var com = new SqlCommand(queries["postcl"], conn);
            com.Parameters.AddWithValue("@name", name);
            com.Parameters.AddWithValue("@contacts", contacts);
            com.Parameters.AddWithValue("@tariff", tariff);
            await com.ExecuteNonQueryAsync();
            await conn.CloseAsync();
            return new OkObjectResult("ok");
        }
        async public Task<List<Request>?> getreq(string qr, object[] args)
        {
            await conn.OpenAsync();
            string qry = "SELECT * FROM test WHERE "+qr+"ORDER BY id ASC";
            var com = new SqlCommand(qry, conn);
            short i = -1;
            foreach (string s in new string[] {"@id","@stage","@company","@deadline","@cost","@areas"})
            {
                i++;
                if (!qry.Contains(s)) continue;
                com.Parameters.AddWithValue(s, args[i]);
            }
            List<Request> res = new List<Request>();
            using (SqlDataReader reader = await com.ExecuteReaderAsync())
            {
                while (reader.Read())
                {
                    Request r = new Request();
                    r.id = int.Parse($"{reader["id"]}");
                    r.cost = int.Parse($"{reader["cost"]}");
                    r.stage = $"{reader["stage"]}";
                    r.company = $"{reader["company"]}";
                    r.deadline = $"{reader["deadline"]}";
                    r.areas = $"{reader["areas"]}";
                    res.Add(r);
                }
            }
            await conn.CloseAsync();
            if (res.Count == 0) return null;
            return res;
        }
    }
}
