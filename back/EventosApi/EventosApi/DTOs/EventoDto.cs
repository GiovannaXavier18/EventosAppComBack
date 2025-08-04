using System.ComponentModel.DataAnnotations;

namespace EventosApi.DTOs
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Local { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string OrganizadorNome { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Preco { get; set; }
        public string OrganizadorId { get; set; }
    }
}
