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
        async public IAsyncEnumerable<Client> GetClient(int id)
        {
            await foreach (Client q in ado.getcl(id)) yield return q;
        }
        [HttpPost("postClient")]
        async public IAsyncEnumerable<string> PostClient(string name,int tariff,string contacts)
        {
            await foreach (string q in ado.postcl(name,tariff,contacts)) yield return q;
        }
    }
}
