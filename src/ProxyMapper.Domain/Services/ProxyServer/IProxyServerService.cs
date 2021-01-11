using System.Threading.Tasks;

namespace ProxyMapper.Domain.Services.ProxyServer
{
    public interface IProxyServerService
    {
        Task<ProxyServerInfoDto[]> GetProxyServers();
    }
}
