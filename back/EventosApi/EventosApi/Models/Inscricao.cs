using System.ComponentModel.DataAnnotations;

namespace EventosApi.Models
{
    public enum StatusInscricao { Confirmada, Cancelada, Aguardando }
    public class Inscricao
    {
        public int Id { get; set; }
        [Required]
        public string UsuarioId { get; set; } = string.Empty;
        public Usuario? Usuario { get; set; }
        [Required]
        public int EventoId { get; set; }
        public Evento? Evento { get; set; }
        public DateTime DataInscricao { get; set; } = DateTime.UtcNow;
        public StatusInscricao Status { get; set; } = StatusInscricao.Confirmada;
    }
}
