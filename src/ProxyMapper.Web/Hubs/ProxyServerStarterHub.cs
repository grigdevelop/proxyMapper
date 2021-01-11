using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using ProxyMapper.Web.Services;

namespace ProxyMapper.Web.Hubs
{
    public class ProxyServerStarterHub : Hub
    {
        private readonly HostManager _hostManager;

        public ProxyServerStarterHub(HostManager hostManager)
        {
            _hostManager = hostManager;
        }

        public async Task StartServer(int port)
        {
            _hostManager.StartWebHost(port);
            await Task.Delay(2000);
            await Clients.All.SendAsync("PROXY_SERVER_STARTED", port);
        }

        public async Task StopServer(int port)
        {
            await _hostManager.StopWebHost(port);
            await Task.Delay(2000);
            await Clients.All.SendAsync("PROXY_SERVER_STOPPED", port);
        }

        private void StartHost()
        {
            
        }

        public void StopHost()
        {
        }
    }
}
