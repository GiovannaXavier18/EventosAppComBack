using EventosApi.Models;
using System.ComponentModel.DataAnnotations;

namespace EventosApi.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public TipoUsuario Tipo { get; set; }
    }
}
