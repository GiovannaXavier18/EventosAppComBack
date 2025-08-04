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
    public class InscricoesController : ControllerBase
    {
        private readonly IInscricaoRepository _inscricaoRepository;
        private readonly IEventoRepository _eventoRepository;

        public InscricoesController(IInscricaoRepository inscricaoRepository, IEventoRepository eventoRepository)
        {
            _inscricaoRepository = inscricaoRepository;
            _eventoRepository = eventoRepository;
        }

        [HttpGet("minhas-inscricoes")]
        public async Task<ActionResult<IEnumerable<InscricaoDto>>> GetMinhasInscricoes()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var inscricoes = await _inscricaoRepository.GetByUserIdAsync(userId);
            var dtos = inscricoes.Select(i => new InscricaoDto
            {
                Id = i.Id,
                NomeEvento = i.Evento?.Titulo ?? "N/A",
                NomeUsuario = i.Usuario?.Nome ?? "N/A",
                DataInscricao = i.DataInscricao,
                Status = i.Status.ToString()
            });
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> FazerInscricao([FromBody] InscricaoCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var evento = await _eventoRepository.GetByIdAsync(dto.EventoId);
            if (evento == null || evento.Status != StatusEvento.Aberto) return BadRequest("Evento não está disponível para inscrição.");
            if (await _inscricaoRepository.UserIsSubscribedAsync(userId, dto.EventoId)) return BadRequest("Utilizador já está inscrito neste evento.");

            var inscricao = new Inscricao { UsuarioId = userId, EventoId = dto.EventoId };
            await _inscricaoRepository.AddAsync(inscricao);

            return Ok(new { Message = "Inscrição realizada com sucesso!", InscricaoId = inscricao.Id });
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Organizador,Admin")]
        public async Task<IActionResult> UpdateStatusInscricao(int id, [FromBody] StatusInscricao novoStatus)
        {
            var inscricao = await _inscricaoRepository.GetByIdAsync(id);
            if (inscricao == null) return NotFound();

            var evento = await _eventoRepository.GetByIdAsync(inscricao.EventoId);
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (evento?.OrganizadorId != currentUserId && !User.IsInRole("Admin")) return Forbid();

            inscricao.Status = novoStatus;
            await _inscricaoRepository.UpdateAsync(inscricao);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelarInscricao(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var inscricao = await _inscricaoRepository.GetByIdAsync(id);

            if (inscricao == null) return NotFound();
            if (inscricao.UsuarioId != userId && !User.IsInRole("Admin")) return Forbid();

            await _inscricaoRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
