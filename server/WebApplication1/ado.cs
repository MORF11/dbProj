using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
namespace WebApplication1
{
    public class ado
    {
        private string connstr = "Server=localhost;Database=test;Trusted_Connection=False;Integrated Security=True;TrustServerCertificate=True;";
        SqlConnection conn;
        public ado()
        {
            conn = new SqlConnection(connstr);
        }
        async public Task<Client?> getcl(int id)
        {
            await conn.OpenAsync();
            Client q = new Client();
            var com =  new SqlCommand("SELECT * FROM Clients WHERE id = @id", conn);
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
            var com = new SqlCommand("INSERT INTO Clients (clientsName, tariff, contacts) VALUES (@name,@tariff,@contacts)", conn);
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
            string qry = "SELECT * FROM dbo.test WHERE " + (string.IsNullOrWhiteSpace(qr) ? "1 = 1" : qr) + " ORDER BY id ASC";
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
                    r.executor = reader["executor"] == DBNull.Value ? null : $"{reader["executor"]}";
                    r.task = reader["task"] == DBNull.Value ? null : $"{reader["task"]}";
                    res.Add(r);
                }
            }
            await conn.CloseAsync();
            if (res.Count == 0) return null;
            return res;
        }
        async public Task<bool> requestexists(int id)
        {
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var com = new SqlCommand("SELECT COUNT(*) FROM dbo.test WHERE id = @id", conn);
                com.Parameters.AddWithValue("@id", id);
                return Convert.ToInt32(await com.ExecuteScalarAsync()) > 0;
            }
        }
        async public Task<IActionResult?> changereq(int id, string field, string value, string? comment)
        {
            if (field != "stage" && field != "executor" && field != "task")
                return new BadRequestObjectResult("invalid data");
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();
                using var com = new SqlCommand("SELECT [" + field + "] FROM test WITH (UPDLOCK, HOLDLOCK) WHERE id = @id", conn, transaction);
                com.Parameters.AddWithValue("@id", id);
                object? old = await com.ExecuteScalarAsync();
                if (old == null)
                    return new NotFoundObjectResult("Заявка не найдена");
                string? oldValue = old == DBNull.Value ? null : Convert.ToString(old);
                if (field == "stage" && string.Equals(oldValue?.Trim(), "завершена", StringComparison.OrdinalIgnoreCase) && value == "в работе")
                    return new ConflictObjectResult("no");
                if (string.Equals(oldValue?.Trim(), value, field == "stage" ? StringComparison.OrdinalIgnoreCase : StringComparison.Ordinal))
                    return new ConflictObjectResult("value reset");
                using var update = new SqlCommand("UPDATE test SET [" + field + "] = @value WHERE id = @id", conn, transaction);
                update.Parameters.AddWithValue("@id", id);
                update.Parameters.AddWithValue("@value", value);
                await update.ExecuteNonQueryAsync();
                using var history = new SqlCommand("INSERT INTO RequestHistory (RequestId, ChangeType, OldValue, NewValue, Comment) VALUES (@id, @field, @old, @value, @comment)", conn, transaction);
                history.Parameters.AddWithValue("@id", id);
                history.Parameters.AddWithValue("@field", field);
                history.Parameters.AddWithValue("@old", (object?)oldValue ?? DBNull.Value);
                history.Parameters.AddWithValue("@value", value);
                history.Parameters.AddWithValue("@comment", (object?)comment ?? DBNull.Value);
                await history.ExecuteNonQueryAsync();
                await transaction.CommitAsync();
                return new OkObjectResult("ok");
            }
        }
        async public Task<IActionResult?> gethistory(int id)
        {
            if (!await requestexists(id)) return new NotFoundObjectResult("Request not found");
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var com = new SqlCommand("SELECT * FROM RequestHistory WHERE RequestId = @id ORDER BY ChangedAt ASC, Id ASC", conn);
                com.Parameters.AddWithValue("@id", id);
                List<requesthistory> res = new List<requesthistory>();
                using (SqlDataReader reader = await com.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        requesthistory r = new requesthistory();
                        r.id = Convert.ToInt32(reader["Id"]);
                        r.requestId = Convert.ToInt32(reader["RequestId"]);
                        r.changeType = $"{reader["ChangeType"]}";
                        r.oldValue = reader["OldValue"] == DBNull.Value ? null : $"{reader["OldValue"]}";
                        r.newValue = reader["NewValue"] == DBNull.Value ? null : $"{reader["NewValue"]}";
                        r.changedAt = DateTime.SpecifyKind(Convert.ToDateTime(reader["ChangedAt"]), DateTimeKind.Utc);
                        r.comment = reader["Comment"] == DBNull.Value ? null : $"{reader["Comment"]}";
                        res.Add(r);
                    }
                }
                return new OkObjectResult(res);
            }
        }
        async public Task<IActionResult?> getcomments(int id)
        {
            if (!await requestexists(id)) return new NotFoundObjectResult("Request not found");
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var com = new SqlCommand("SELECT * FROM RequestComments WHERE RequestId = @id ORDER BY CreatedAt ASC, Id ASC", conn);
                com.Parameters.AddWithValue("@id", id);
                List<RequestComment> res = new List<RequestComment>();
                using (SqlDataReader reader = await com.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        RequestComment r = new RequestComment();
                        r.id = Convert.ToInt32(reader["Id"]);
                        r.requestId = Convert.ToInt32(reader["RequestId"]);
                        r.authorId = reader["AuthorId"] == DBNull.Value ? null : Convert.ToInt32(reader["AuthorId"]);
                        r.text = $"{reader["Text"]}";
                        r.createdAt = DateTime.SpecifyKind(Convert.ToDateTime(reader["CreatedAt"]), DateTimeKind.Utc);
                        res.Add(r);
                    }
                }
                return new OkObjectResult(res);
            }
        }
        async public Task<IActionResult?> postcomment(int id, string text, int? authorId)
        {
            if (!await requestexists(id)) return new NotFoundObjectResult("Request not found");
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var com = new SqlCommand("INSERT INTO RequestComments (RequestId, AuthorId, [Text]) OUTPUT inserted.Id, inserted.CreatedAt VALUES (@id, @authorId, @text)", conn);
                com.Parameters.AddWithValue("@id", id);
                com.Parameters.AddWithValue("@authorId", (object?)authorId ?? DBNull.Value);
                com.Parameters.AddWithValue("@text", text);
                try
                {
                    using SqlDataReader reader = await com.ExecuteReaderAsync();
                    await reader.ReadAsync();
                    RequestComment r = new RequestComment();
                    r.id = Convert.ToInt32(reader["Id"]);
                    r.requestId = id;
                    r.authorId = authorId;
                    r.text = text;
                    r.createdAt = DateTime.SpecifyKind(Convert.ToDateTime(reader["CreatedAt"]), DateTimeKind.Utc);
                    return new ObjectResult(r) { StatusCode = StatusCodes.Status201Created };
                }
                catch (SqlException ex) when (ex.Number == 547)
                {
                    return new NotFoundObjectResult("Request not found");
                }
            }
        }
        async public Task<IActionResult?> changecomment(int requestId, int commentId, string? text, int? authorId, bool delete)
        {
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();
                using var request = new SqlCommand("SELECT id FROM test WITH (UPDLOCK, HOLDLOCK) WHERE id = @id", conn, transaction);
                request.Parameters.AddWithValue("@id", requestId);
                if (await request.ExecuteScalarAsync() == null) return new NotFoundObjectResult("Заявка не найдена");
                using var com = new SqlCommand("SELECT AuthorId FROM RequestComments WITH (UPDLOCK, HOLDLOCK) WHERE Id = @commentId AND RequestId = @requestId", conn, transaction);
                com.Parameters.AddWithValue("@commentId", commentId);
                com.Parameters.AddWithValue("@requestId", requestId);
                object? owner = await com.ExecuteScalarAsync();
                if (owner == null) return new NotFoundObjectResult("Comment not found");
                if (owner != DBNull.Value)
                {
                    if (authorId == null) return new UnauthorizedResult();
                    if (Convert.ToInt32(owner) != authorId.Value) return new StatusCodeResult(StatusCodes.Status403Forbidden);
                }
                string qry = delete
                    ? "DELETE FROM RequestComments WHERE Id = @commentId AND RequestId = @requestId"
                    : "UPDATE RequestComments SET [Text] = @text WHERE Id = @commentId AND RequestId = @requestId";
                using var update = new SqlCommand(qry, conn, transaction);
                update.Parameters.AddWithValue("@commentId", commentId);
                update.Parameters.AddWithValue("@requestId", requestId);
                if (!delete) update.Parameters.AddWithValue("@text", text!);
                await update.ExecuteNonQueryAsync();
                await transaction.CommitAsync();
                if (delete) return new NoContentResult();
                return new OkObjectResult("ok");
            }
        }
        async public Task<IActionResult?> postattachment(int requestId, string originalName, string storedName, string contentType, long sizeBytes)
        {
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                await conn.OpenAsync();
                using var com = new SqlCommand("INSERT INTO RequestAttachments (RequestId, OriginalName, StoredName, ContentType, SizeBytes) " +
                    "OUTPUT inserted.Id, inserted.CreatedAt VALUES (@requestId, @originalName, @storedName, @contentType, @sizeBytes)", conn);
                com.Parameters.AddWithValue("@requestId", requestId);
                com.Parameters.AddWithValue("@originalName", originalName);
                com.Parameters.AddWithValue("@storedName", storedName);
                com.Parameters.AddWithValue("@contentType", contentType);
                com.Parameters.AddWithValue("@sizeBytes", sizeBytes);
                try
                {
                    using SqlDataReader reader = await com.ExecuteReaderAsync();
                    await reader.ReadAsync();
                    RequestAttachment r = new RequestAttachment();
                    r.id = Convert.ToInt32(reader["Id"]);
                    r.requestId = requestId;
                    r.originalName = originalName;
                    r.contentType = contentType;
                    r.sizeBytes = sizeBytes;
                    r.createdAt = DateTime.SpecifyKind(Convert.ToDateTime(reader["CreatedAt"]), DateTimeKind.Utc);
                    return new ObjectResult(r) { StatusCode = StatusCodes.Status201Created };
                }
                catch (SqlException ex) when (ex.Number == 547)
                {
                    return new NotFoundObjectResult("Request not found");
                }
            }
        }
    }
}
