using Microsoft.Data.SqlClient;
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
        async public IAsyncEnumerable<Client> getcl(int id)
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
            if (q.name == null) yield return null;
            yield return q;
        }
        async public IAsyncEnumerable<string> postcl(string name, int tariff, string contacts)
        {
            await conn.OpenAsync();
            var com = new SqlCommand(queries["postcl"], conn);
            com.Parameters.AddWithValue("@name", name);
            com.Parameters.AddWithValue("@contacts", contacts);
            com.Parameters.AddWithValue("@tariff", tariff);
            await com.ExecuteNonQueryAsync();
            await conn.CloseAsync();
            yield return "ok";
        }
    }
}
