using EventosApi.Models;

namespace EventosApi.Repositories.Interfaces
{
    public interface IInscricaoRepository
    {
        Task<Inscricao?> GetByIdAsync(int id);
        Task<IEnumerable<Inscricao>> GetByUserIdAsync(string userId);
        Task<Inscricao> AddAsync(Inscricao inscricao);
        Task UpdateAsync(Inscricao inscricao);
        Task DeleteAsync(int id);
        Task<bool> UserIsSubscribedAsync(string userId, int eventoId);
    }
}
