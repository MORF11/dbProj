using Microsoft.Data.SqlClient;
namespace WebApplication1
{
    public class ado
    {
        private string connstr = "Server=localhost;Database=test;Trusted_Connection=True;";
        SqlConnection conn;

        private Dictionary<string, string> queries;
        public ado()
        {
            conn = new SqlConnection(connstr);
            conn.OpenAsync();
            queries = new Dictionary<string, string>()
            {
                { "getcl", "SELECT FROM Clients (id,clientName,tariff,contracts) WHERE id = " },
            };
        }
        public Client getcl(int id)
        {
            Client q = new Client();
            using (SqlDataReader reader = new SqlCommand(queries["getcl"]+$"{id}",conn).ExecuteReader())
            {
                while (reader.Read())
                {
                    q.id = int.Parse($"{reader["id"]}");
                    q.name = $"{reader["name"]}";
                    q.tariff = int.Parse($"{reader["tariff"]}");
                    q.contacts = $"{reader["contacts"]}";
                }
            }
            return q;
        }
    }
}
