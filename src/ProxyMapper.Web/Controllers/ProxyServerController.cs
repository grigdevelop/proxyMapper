using Microsoft.AspNetCore.Mvc;
using ProxyMapper.Domain.Services.ProxyServer;
using System;
using System.Threading.Tasks;
using ProxyMapper.Web.Services;

namespace ProxyMapper.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProxyServerController : ControllerBase
    {
        private readonly IProxyServerService _proxyServerService;
        private readonly HostManager _hostManager;

        public ProxyServerController(IProxyServerService proxyServerService, HostManager hostManager)
        {
            _proxyServerService = proxyServerService ?? throw new ArgumentNullException(nameof(proxyServerService));
            _hostManager = hostManager ?? throw new ArgumentNullException(nameof(hostManager));
        }

        [HttpGet("GetProxyServers")]
        public async Task<ProxyServerInfoDto[]> GetProxyServers()
        {
            var proxyServers = await _proxyServerService.GetProxyServers();
            return proxyServers;
        }

        [HttpGet("GetRunningProxyServers")]
        public int[] GetRunningProxyServers()
        {
            var proxyServers = _hostManager.GetRunningPorts();
            return proxyServers;
        }
    }
}
