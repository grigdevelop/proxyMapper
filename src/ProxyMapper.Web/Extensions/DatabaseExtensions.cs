using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ProxyMapper.Domain.Database;
using ProxyMapper.Domain.Database.Seeds;

namespace ProxyMapper.Web.Extensions
{
    public static class DatabaseExtensions
    {
        public static void AddDatabaseServices(this IServiceCollection services, string dbConnection)
        {
            var builder = new DbContextOptionsBuilder<ProxyDbContext>();
            builder.UseSqlite(dbConnection);
            var dbContext = new ProxyDbContext(builder.Options);
            services.AddSingleton(dbContext);
        }

        public static void UseProxyDatabase(this IApplicationBuilder app)
        {
            var dbContext = app.ApplicationServices.GetService<ProxyDbContext>();
            if (dbContext == null) throw new ArgumentNullException(nameof(dbContext));
            //if (!dbContext.Database.EnsureCreated())
            dbContext.Database.EnsureCreated();
            {
                dbContext.Database.Migrate();
                SeedData.Init(dbContext);
            }
        }
    }
}
