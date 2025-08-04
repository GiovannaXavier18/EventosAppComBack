namespace EventosApi.DTOs
{
    public class InscricaoDto
    {
        public int Id { get; set; }
        public string NomeEvento { get; set; } = string.Empty;
        public string NomeUsuario { get; set; } = string.Empty;
        public DateTime DataInscricao { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
