using ProxyMapper.Domain.Database.Entities;

namespace ProxyMapper.Domain.Database.Seeds
{
    public class SeedData
    {
        public static void Init(ProxyDbContext dbContext)
        {
            dbContext.ProxyServerInfos.AddRange(new []
            {
                new ProxyServerInfo{Port = 8080},
                new ProxyServerInfo{Port = 9090}
            });
            dbContext.SaveChanges();
        }
    }
}
