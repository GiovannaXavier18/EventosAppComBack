using EventosApi.Models;
using System.ComponentModel.DataAnnotations;

namespace EventosApi.DTOs
{
    public class PagamentoCreateDto
    {
        [Required]
        public int InscricaoId { get; set; }
        [Required]
        public decimal Valor { get; set; }
        public MetodoPagamento MetodoPagamento { get; set; }
    }
}
