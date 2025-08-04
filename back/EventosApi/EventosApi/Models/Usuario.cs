using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace EventosApi.Models
{
    public enum TipoUsuario { Organizador, Participante, Admin }
    public class Usuario : IdentityUser
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        public TipoUsuario Tipo { get; set; } = TipoUsuario.Participante;
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
