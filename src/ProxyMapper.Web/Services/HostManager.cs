using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace ProxyMapper.Web.Services
{
    public class HostManager
    {
        private readonly IDictionary<int, IHost> _hosts 
            = new ConcurrentDictionary<int, IHost>();

        public void StartWebHost(int port)
        {
            var host = BuildHost(port);
            _hosts.Add(port, host);
            host.RunAsync();
        }

        public async Task StopWebHost(int port)
        {
            await _hosts[port].StopAsync();
            _hosts.Remove(port);
        }

        public int[] GetRunningPorts()
        {
            return _hosts.Keys.ToArray();
        }

        private IHost BuildHost(int port)
        {
            var host = Host.CreateDefaultBuilder()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls($"http://localhost:{port}/");
                    webBuilder.Configure(app =>
                    {
                        app.Run(async (context) =>
                        {
                            await context.Response.WriteAsync("Hello Mello");
                        });

                    });
                }).Build();
            return host;
        }
    }
}
