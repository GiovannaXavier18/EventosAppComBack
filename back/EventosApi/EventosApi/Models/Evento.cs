using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventosApi.Models
{
    public enum CategoriaEvento { Palestra, Show, Curso, Conferencia, Outro }
    public enum StatusEvento { Aberto, Encerrado, Cancelado }
    public class Evento
    {
        public int Id { get; set; }
        [Required]
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Local { get; set; } = string.Empty;
        public CategoriaEvento Categoria { get; set; }
        public StatusEvento Status { get; set; } = StatusEvento.Aberto;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Preco { get; set; }  

        [Required]
        public string OrganizadorId { get; set; } = string.Empty;
        public Usuario? Organizador { get; set; }
        public ICollection<Inscricao> Inscricoes { get; set; } = new List<Inscricao>();
    }
}