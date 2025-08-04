using EventosApi.Models;
using System.ComponentModel.DataAnnotations;

namespace EventosApi.DTOs
{
    public class EventoCreateUpdateDto
    {
        [Required]
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        [Required]
        public string Local { get; set; } = string.Empty;
        public CategoriaEvento Categoria { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Preco { get; set; }
    }
}
