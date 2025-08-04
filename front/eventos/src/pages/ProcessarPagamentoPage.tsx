import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventoById } from '../services/eventoService';
import { createPagamento } from '../services/pagamentoService';
import type { PagamentoPayload } from '../types/api';

export function ProcessarPagamentoPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: evento, isLoading } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => getEventoById(eventId),
    enabled: !!eventId,
  });

  const mutation = useMutation({
    mutationFn: (payload: PagamentoPayload) => createPagamento(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meusPagamentos'] });
      alert('Pagamento processado com sucesso!');
      navigate('/meus-pagamentos');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Falha ao processar o pagamento.');
    },
  });

  const handlePayment = () => {
    if (!evento) return;
    mutation.mutate({
      eventoId: evento.id,
      valor: evento.preco,
      metodoPagamento: 'Cartão de Crédito Fictício',
    });
  };

  if (isLoading) {
    return <div className="text-center p-10">Carregando informações para pagamento...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8">Finalizar Pagamento</h1>
      <div className="bg-gray-800 rounded-xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">{evento?.titulo}</h2>
        <p className="text-gray-300 mb-6 text-lg">Você está prestes a finalizar a sua inscrição. Revise os detalhes e confirme o pagamento.</p>
        <div className="border-t border-b border-gray-700 py-6 my-6">
          <div className="flex justify-between items-center text-xl">
            <span className="text-gray-300">Valor Total:</span>
            <span className="font-bold text-white text-3xl">
              {evento?.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={mutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-md transition-colors disabled:bg-gray-500 text-xl"
        >
          {mutation.isPending ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
      </div>
    </div>
  );
}