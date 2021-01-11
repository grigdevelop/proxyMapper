using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ProxyMapper.Domain.Database.Entities;

namespace ProxyMapper.Domain.Database
{
    public class ProxyDbContext : DbContext
    {
        public DbSet<ProxyServerInfo> ProxyServerInfos { get; set; }

        public ProxyDbContext(DbContextOptions options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
