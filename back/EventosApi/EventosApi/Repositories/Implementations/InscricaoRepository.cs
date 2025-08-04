using EventosApi.Data;
using EventosApi.Models;
using EventosApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventosApi.Repositories.Implementations
{
    public class InscricaoRepository : IInscricaoRepository
    {
        private readonly ApiDbContext _context;

        public InscricaoRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<Inscricao?> GetByIdAsync(int id)
        {
            return await _context.Inscricoes.FindAsync(id);
        }

        public async Task<IEnumerable<Inscricao>> GetByUserIdAsync(string userId)
        {
            return await _context.Inscricoes
                .Include(i => i.Evento)
                .Where(i => i.UsuarioId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Inscricao> AddAsync(Inscricao inscricao)
        {
            await _context.Inscricoes.AddAsync(inscricao);
            await _context.SaveChangesAsync();
            return inscricao;
        }
        public async Task UpdateAsync(Inscricao inscricao)
        {
            _context.Inscricoes.Update(inscricao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var inscricao = await _context.Inscricoes.FindAsync(id);
            if (inscricao != null)
            {
                _context.Inscricoes.Remove(inscricao);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UserIsSubscribedAsync(string userId, int eventoId)
        {
            return await _context.Inscricoes.AnyAsync(i => i.UsuarioId == userId && i.EventoId == eventoId);
        }
    }
}
