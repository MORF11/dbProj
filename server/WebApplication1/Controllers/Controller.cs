using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/v1[controller]")]
    public class Controller : ControllerBase
    {
        private readonly ILogger<Controller> _logger;
        private ado ado;

        public Controller(ILogger<Controller> logger)
        {
            _logger = logger;
            ado = new ado();
        }
        [HttpGet("getClient")]
        async public Task<Client?> GetClient(int id)
        {
            return await ado.getcl(id);
        }
        [HttpPost("postClient")]
        async public Task<IActionResult?> PostClient([FromBody] Client cl)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (string.IsNullOrWhiteSpace(cl.name)) return BadRequest(ModelState);
            return await ado.postcl(cl.name,cl.tariff,cl.contacts);
        }
        [HttpGet("getRequest")]
        async public Task<List<Request>?> GetRequest(int id = -1,string stage = "",string company = "",string deadline = "",int cost = -1,string areas = "")
        {
            string qry = "";
            bool isfrst = true;
            if (id != -1)
            {
                if (isfrst) { qry += $"id = @id"; isfrst = false; }
                else qry += $" AND id = @id";
            }
            if (stage != "")
            {
                if (isfrst) { qry += $"stage = @stage"; isfrst = false; }
                else qry += $" AND stage = @stage";
            }
            if (company != "")
            {
                if (isfrst) { qry += $"company = @company"; isfrst = false; }
                else qry += $" AND company = @company";
            }
            if (deadline != "")
            {
                if (isfrst) { qry += $"deadline = @deadline"; isfrst = false; }
                else qry += $" AND deadline = @deadline";
            }
            if (cost != -1)
            {
                if (isfrst) { qry += $"cost = @cost"; isfrst = false; }
                else qry += $" AND cost = @cost";
            }
            if (areas != "")
            {
                if (isfrst) { qry += $"areas = @areas"; isfrst = false; }
                else qry += $" AND areas = @areas";
            }
            return await ado.getreq(qry,new object[]{id,stage,company,deadline,cost,areas});
        }
        [HttpPatch("changeStatus")]
        async public Task<IActionResult?> ChangeStatus([FromBody] RequestChange r)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (r.id <= 0 || string.IsNullOrWhiteSpace(r.stage) || r.comment?.Length > 2000)
                return BadRequest("Укажите id, статус и комментарий не длиннее 2000 символов");
            string stage = r.stage.Trim().ToLowerInvariant();
            if (stage != "новая" && stage != "в работе" && stage != "завершена" && stage != "отменена")
                return BadRequest("Допустимые статусы: новая, в работе, завершена, отменена");
            return await ado.changereq(r.id, "stage", stage, r.comment);
        }
        [HttpPatch("assignExecutor")]
        async public Task<IActionResult?> AssignExecutor([FromBody] ExecutorChange r)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (r.id <= 0 || string.IsNullOrWhiteSpace(r.executor) || r.executor.Length > 200 || r.comment?.Length > 2000)
                return BadRequest("Укажите id и имя исполнителя до 200 символов; комментарий — до 2000 символов");
            return await ado.changereq(r.id, "executor", r.executor.Trim(), r.comment);
        }
        [HttpPatch("changeTask")]
        async public Task<IActionResult?> ChangeTask([FromBody] TaskChange r)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (r.id <= 0 || string.IsNullOrWhiteSpace(r.task) || r.task.Length > 2000 || r.comment?.Length > 2000)
                return BadRequest("Укажите id и задачу; задача и комментарий — до 2000 символов");
            return await ado.changereq(r.id, "task", r.task.Trim(), r.comment);
        }
        [HttpGet("getHistory/{id:int}")]
        async public Task<IActionResult?> GetHistory(int id)
        {
            if (id <= 0) return BadRequest("Некорректный id заявки");
            return await ado.gethistory(id);
        }
        [HttpGet("getComments/{id:int}")]
        async public Task<IActionResult?> GetComments(int id)
        {
            if (id <= 0) return BadRequest("Некорректный id заявки");
            return await ado.getcomments(id);
        }
        private int? getauthorid()
        {
            if (User.Identity?.IsAuthenticated != true) return null;
            string? value = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
            if (int.TryParse(value, out int id) && id > 0) return id;
            return null;
        }
        [HttpPost("postComment/{id:int}")]
        async public Task<IActionResult?> PostComment(int id, [FromBody] CommentChange r)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id <= 0 || string.IsNullOrWhiteSpace(r.text) || r.text.Length > 4000)
                return BadRequest("Укажите id и непустой комментарий до 4000 символов");
            int? authorId = getauthorid();
            if (User.Identity?.IsAuthenticated == true && authorId == null) return Unauthorized();
            return await ado.postcomment(id, r.text.Trim(), authorId);
        }
        [HttpPut("changeComment/{requestId:int}/{commentId:int}")]
        async public Task<IActionResult?> ChangeComment(int requestId, int commentId, [FromBody] CommentChange r)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (requestId <= 0 || commentId <= 0 || string.IsNullOrWhiteSpace(r.text) || r.text.Length > 4000)
                return BadRequest("Укажите корректные id и непустой комментарий до 4000 символов");
            int? authorId = getauthorid();
            if (User.Identity?.IsAuthenticated == true && authorId == null) return Unauthorized();
            return await ado.changecomment(requestId, commentId, r.text.Trim(), authorId, false);
        }
        [HttpDelete("deleteComment/{requestId:int}/{commentId:int}")]
        async public Task<IActionResult?> DeleteComment(int requestId, int commentId)
        {
            if (requestId <= 0 || commentId <= 0) return BadRequest("Некорректные id");
            int? authorId = getauthorid();
            if (User.Identity?.IsAuthenticated == true && authorId == null) return Unauthorized();
            return await ado.changecomment(requestId, commentId, null, authorId, true);
        }
        [HttpPost("postAttachment/{id:int}")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(6 * 1024 * 1024)]
        [RequestFormLimits(MultipartBodyLengthLimit = 6 * 1024 * 1024)]
        async public Task<IActionResult?> PostAttachment(int id, [FromForm] AttachmentUpload upload)
        {
            const long maxSize = 5 * 1024 * 1024;
            IFormFile? file = upload.file;
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id <= 0 || file == null || file.Length == 0) return BadRequest("Укажите заявку и непустой файл");
            if (file.Length > maxSize) return StatusCode(StatusCodes.Status413PayloadTooLarge, "Максимальный размер файла — 5 МБ");
            if (!await ado.requestexists(id)) return NotFound("Заявка не найдена");
            string originalName = Path.GetFileName(file.FileName.Replace('\\', '/'));
            if (string.IsNullOrWhiteSpace(originalName) || originalName.Length > 255)
                return BadRequest("Имя файла должно содержать от 1 до 255 символов");
            string extension = Path.GetExtension(originalName).ToLowerInvariant();
            string contentType;
            if (extension == ".pdf") contentType = "application/pdf";
            else if (extension == ".png") contentType = "image/png";
            else if (extension == ".jpg" || extension == ".jpeg") contentType = "image/jpeg";
            else return StatusCode(StatusCodes.Status415UnsupportedMediaType, "Разрешены только PDF, PNG и JPEG");
            using var data = new MemoryStream();
            using (Stream input = file.OpenReadStream())
            {
                byte[] buffer = new byte[81920];
                int count;
                while ((count = await input.ReadAsync(buffer.AsMemory(), HttpContext.RequestAborted)) > 0)
                {
                    if (data.Length + count > maxSize)
                        return StatusCode(StatusCodes.Status413PayloadTooLarge, "Максимальный размер файла — 5 МБ");
                    await data.WriteAsync(buffer.AsMemory(0, count), HttpContext.RequestAborted);
                }
            }
            byte[] bytes = data.ToArray();
            bool valid;
            if (extension == ".pdf")
                valid = bytes.Length >= 5 && bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46 && bytes[4] == 0x2D;
            else if (extension == ".png")
                valid = bytes.Length >= 8 && bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47 && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A;
            else
                valid = bytes.Length >= 3 && bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF;
            if (!valid) return StatusCode(StatusCodes.Status415UnsupportedMediaType, "Содержимое файла не соответствует расширению");
            string directory = Path.Combine(AppContext.BaseDirectory, "RequestFiles");
            string storedName = Guid.NewGuid().ToString("N") + extension;
            string path = Path.Combine(directory, storedName);
            bool created = false;
            bool saved = false;
            try
            {
                Directory.CreateDirectory(directory);
                using (var output = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, true))
                {
                    created = true;
                    await output.WriteAsync(bytes.AsMemory(), HttpContext.RequestAborted);
                }
                IActionResult? result = await ado.postattachment(id, originalName, storedName, contentType, bytes.LongLength);
                saved = result is ObjectResult r && r.StatusCode == StatusCodes.Status201Created;
                return result;
            }
            catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка сохранения вложения заявки {RequestId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Не удалось сохранить вложение");
            }
            finally
            {
                if (created && !saved)
                {
                    try { System.IO.File.Delete(path); }
                    catch (Exception ex) { _logger.LogError(ex, "Не удалось удалить несохранённое вложение {StoredName}", storedName); }
                }
            }
        }
    }
}
