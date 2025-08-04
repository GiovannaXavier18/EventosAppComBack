namespace EventosApi.DTOs
{
    public class PagamentoDto
    {
        public int Id { get; set; }
        public int EventoId { get; set; }
        public decimal Valor { get; set; }
        public string Status { get; set; } = string.Empty;
        public string MetodoPagamento { get; set; } = string.Empty;
        public DateTime? DataPagamento { get; set; }
    }
}
