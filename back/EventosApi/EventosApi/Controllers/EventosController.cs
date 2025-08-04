using EventosApi.DTOs;
using EventosApi.Models;
using EventosApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoRepository _eventoRepository;
        public EventosController(IEventoRepository eventoRepository) { _eventoRepository = eventoRepository; }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<EventoDto>> GetEvento(int id)
        {
            var evento = await _eventoRepository.GetByIdAsync(id);

            if (evento == null)
            {
                return NotFound();
            }

            var dto = new EventoDto
            {
                Id = evento.Id,
                Titulo = evento.Titulo,
                Descricao = evento.Descricao,
                DataInicio = evento.DataInicio,
                DataFim = evento.DataFim,
                Local = evento.Local,
                Categoria = evento.Categoria.ToString(),
                Status = evento.Status.ToString(),
                OrganizadorNome = evento.Organizador?.Nome ?? "N/A",
                OrganizadorId = evento.OrganizadorId,
                Preco = evento.Preco
            };

            return Ok(dto);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventoDto>>> GetEventos()
        {
            var eventos = await _eventoRepository.GetAllAsync();
            var dtos = eventos.Select(e => new EventoDto
            {
                Id = e.Id,
                Titulo = e.Titulo,
                Descricao = e.Descricao,
                DataInicio = e.DataInicio,
                DataFim = e.DataFim,
                Local = e.Local,
                Categoria = e.Categoria.ToString(),
                Status = e.Status.ToString(),
                OrganizadorNome = e.Organizador?.Nome ?? "N/A",
                OrganizadorId = e.OrganizadorId,
                Preco = e.Preco
            });
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "Organizador,Admin")]
        public async Task<ActionResult<Evento>> PostEvento([FromBody] EventoCreateUpdateDto dto)
        {
            var organizadorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (organizadorId == null) return Unauthorized();

            var evento = new Evento
            {
                Titulo = dto.Titulo,
                Descricao = dto.Descricao,
                DataInicio = dto.DataInicio,
                DataFim = dto.DataFim,
                Local = dto.Local,
                Categoria = dto.Categoria,
                Preco = dto.Preco,
                OrganizadorId = organizadorId
            };

            var novoEvento = await _eventoRepository.AddAsync(evento);

            return CreatedAtAction(nameof(GetEvento), new { id = novoEvento.Id }, novoEvento);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Organizador,Admin")]
        public async Task<IActionResult> PutEvento(int id, [FromBody] EventoCreateUpdateDto dto)
        {
            var evento = await _eventoRepository.GetByIdAsync(id);
            if (evento == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (evento.OrganizadorId != userId && !User.IsInRole("Admin")) return Forbid();

            evento.Titulo = dto.Titulo;
            evento.Descricao = dto.Descricao;
            evento.DataInicio = dto.DataInicio;
            evento.DataFim = dto.DataFim;
            evento.Local = dto.Local;
            evento.Categoria = dto.Categoria;
            evento.Preco = dto.Preco;

            await _eventoRepository.UpdateAsync(evento);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizador,Admin")]
        public async Task<IActionResult> DeleteEvento(int id)
        {
            var evento = await _eventoRepository.GetByIdAsync(id);
            if (evento == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (evento.OrganizadorId != userId && !User.IsInRole("Admin")) return Forbid();

            await _eventoRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}