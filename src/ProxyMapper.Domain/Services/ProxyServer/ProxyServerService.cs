using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProxyMapper.Domain.Database;

namespace ProxyMapper.Domain.Services.ProxyServer
{
    public class ProxyServerInfoDto
    {
        public int Id { get; set; }

        public int Port { get; set; }
    }

    public class ProxyServerService : IProxyServerService
    {
        private readonly ProxyDbContext _dbContext;

        public ProxyServerService(ProxyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ProxyServerInfoDto[]> GetProxyServers()
        {
            return (await _dbContext.ProxyServerInfos.ToListAsync()).Select(psi => new ProxyServerInfoDto
            {
                Id = psi.Id,
                Port = psi.Port
            }).ToArray();
        }
    }
}
