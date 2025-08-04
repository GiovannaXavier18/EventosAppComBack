using EventosApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EventosApi.Data
{
    public class ApiDbContext : IdentityDbContext<Usuario>
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options) { }

        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Inscricao> Inscricoes { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Pagamento>()
                .Property(p => p.Valor)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Usuario>().Property(u => u.Tipo).HasConversion<string>();
            modelBuilder.Entity<Evento>().Property(e => e.Categoria).HasConversion<string>();
            modelBuilder.Entity<Evento>().Property(e => e.Status).HasConversion<string>();
            modelBuilder.Entity<Inscricao>().Property(i => i.Status).HasConversion<string>();
            modelBuilder.Entity<Pagamento>().Property(p => p.Status).HasConversion<string>();
            modelBuilder.Entity<Pagamento>().Property(p => p.MetodoPagamento).HasConversion<string>();
        }
    }
}
