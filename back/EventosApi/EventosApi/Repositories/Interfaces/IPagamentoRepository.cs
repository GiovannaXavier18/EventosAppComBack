using EventosApi.Models;

namespace EventosApi.Repositories.Interfaces
{
    public interface IPagamentoRepository
    {
        Task<Pagamento?> GetByIdAsync(int id);
        Task<IEnumerable<Pagamento>> GetByUserIdAsync(string userId);
        Task<Pagamento> AddAsync(Pagamento pagamento);
        Task UpdateAsync(Pagamento pagamento);
    }
}
