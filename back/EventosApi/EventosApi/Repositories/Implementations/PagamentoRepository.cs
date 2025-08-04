using EventosApi.Data;
using EventosApi.Models;
using EventosApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventosApi.Repositories.Implementations
{
    public class PagamentoRepository : IPagamentoRepository
    {
        private readonly ApiDbContext _context;
        public PagamentoRepository(ApiDbContext context) { _context = context; }

        public async Task<Pagamento?> GetByIdAsync(int id) => await _context.Pagamentos.Include(p => p.Evento).AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        public async Task<IEnumerable<Pagamento>> GetByUserIdAsync(string userId) => await _context.Pagamentos.Include(p => p.Evento).Where(p => p.UsuarioId == userId).AsNoTracking().ToListAsync();

        public async Task<Pagamento> AddAsync(Pagamento pagamento)
        {
            await _context.Pagamentos.AddAsync(pagamento);
            await _context.SaveChangesAsync();
            return pagamento;
        }

        public async Task UpdateAsync(Pagamento pagamento)
        {
            _context.Pagamentos.Update(pagamento);
            await _context.SaveChangesAsync();
        }
    }
}