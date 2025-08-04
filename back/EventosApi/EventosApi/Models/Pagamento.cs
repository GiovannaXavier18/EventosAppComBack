using System.ComponentModel.DataAnnotations;

namespace EventosApi.Models
{
    public enum StatusPagamento { Pago, Pendente, Falhou }
    public enum MetodoPagamento { Cartao, Pix, Boleto }
    public class Pagamento
    {
        public int Id { get; set; }
        [Required]
        public string UsuarioId { get; set; } = string.Empty;
        public Usuario? Usuario { get; set; }
        [Required]
        public int EventoId { get; set; }
        public Evento? Evento { get; set; }
        public decimal Valor { get; set; }
        public StatusPagamento Status { get; set; } = StatusPagamento.Pendente;
        public DateTime? DataPagamento { get; set; }
        public MetodoPagamento MetodoPagamento { get; set; }
    }
}
