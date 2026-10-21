using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

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
        async public Task<List<Request>?> GetRequest(int id,string stage,string company,string deadline,int cost,string areas)
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
    }
}
