using EventosApi.DTOs;
using EventosApi.Models;
using EventosApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventosApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PagamentosController : ControllerBase
    {
        private readonly IPagamentoRepository _pagamentoRepository;
        private readonly IInscricaoRepository _inscricaoRepository;

        public PagamentosController(IPagamentoRepository pagamentoRepository, IInscricaoRepository inscricaoRepository)
        {
            _pagamentoRepository = pagamentoRepository;
            _inscricaoRepository = inscricaoRepository;
        }

        [HttpGet("meus-pagamentos")]
        public async Task<ActionResult<IEnumerable<PagamentoDto>>> GetMeusPagamentos()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var pagamentos = await _pagamentoRepository.GetByUserIdAsync(userId);
            var dtos = pagamentos.Select(p => new PagamentoDto
            {
                Id = p.Id,
                EventoId = p.EventoId,
                Valor = p.Valor,
                Status = p.Status.ToString(),
                MetodoPagamento = p.MetodoPagamento.ToString(),
                DataPagamento = p.DataPagamento
            });
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> IniciarPagamento([FromBody] PagamentoCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var inscricao = await _inscricaoRepository.GetByIdAsync(dto.InscricaoId);
            if (inscricao == null || inscricao.UsuarioId != userId) return Forbid("Esta inscrição não pertence ao utilizador.");

            var pagamento = new Pagamento
            {
                UsuarioId = userId,
                EventoId = inscricao.EventoId,
                Valor = dto.Valor,
                MetodoPagamento = dto.MetodoPagamento,
                Status = StatusPagamento.Pendente
            };

            var novoPagamento = await _pagamentoRepository.AddAsync(pagamento);
            return Ok(new { Message = "Processo de pagamento iniciado.", PagamentoId = novoPagamento.Id });
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatusPagamento(int id, [FromBody] StatusPagamento novoStatus)
        {
            var pagamento = await _pagamentoRepository.GetByIdAsync(id);
            if (pagamento == null) return NotFound();

            pagamento.Status = novoStatus;
            if (novoStatus == StatusPagamento.Pago)
            {
                pagamento.DataPagamento = DateTime.UtcNow;
            }

            await _pagamentoRepository.UpdateAsync(pagamento);
            return NoContent();
        }
    }
}
