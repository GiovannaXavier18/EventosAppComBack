using EventosApi.Data;
using EventosApi.Models;
using EventosApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventosApi.Repositories.Implementations
{
    public class EventoRepository : IEventoRepository
    {
        private readonly ApiDbContext _context;

        public EventoRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Evento>> GetAllAsync()
        {
            return await _context.Eventos
                                 .Include(e => e.Organizador)
                                 .Where(e => e.DataInicio > DateTime.UtcNow)
                                 .OrderBy(e => e.DataInicio)         
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        public async Task<Evento?> GetByIdAsync(int id)
        {
            return await _context.Eventos.Include(e => e.Organizador).AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Evento> AddAsync(Evento evento)
        {
            await _context.Eventos.AddAsync(evento);
            await _context.SaveChangesAsync();
            return evento;
        }

        public async Task UpdateAsync(Evento evento)
        {
            _context.Eventos.Update(evento);
            _context.Entry(evento).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {   
            var evento = await _context.Eventos.FindAsync(id);
            if (evento != null)
            {
                _context.Eventos.Remove(evento);
                await _context.SaveChangesAsync();
            }
        }
    }
}
