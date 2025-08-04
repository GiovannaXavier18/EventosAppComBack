import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventoById, deleteEvento } from '../services/eventoService';
import { createInscricao, getMinhasInscricoes } from '../services/inscricaoService';
import { useAuth } from '../context/AuthContext';

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: evento, isLoading, isError, error } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => getEventoById(eventId),
    enabled: !!eventId,
  });

  const { data: minhasInscricoes } = useQuery({
    queryKey: ['minhasInscricoes'],
    queryFn: getMinhasInscricoes,
    enabled: isAuthenticated,
  });

  const inscricaoMutation = useMutation({
    mutationFn: createInscricao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhasInscricoes'] });
      navigate(`/pagamento/processar/${eventId}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Falha na inscrição.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvento,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['eventos'] });
        navigate('/eventos');
    },
    onError: (err: any) => {
        alert(err.response?.data?.message || 'Falha ao excluir evento.');
    }
  });

  const handleInscricao = () => {
    inscricaoMutation.mutate({ eventoId: eventId });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) {
        deleteMutation.mutate(eventId);
    }
  }

  const isAlreadyInscrito = minhasInscricoes?.some(insc => insc.nomeEvento === evento?.titulo);
  const isOwner = isAuthenticated && user?.id.toString() === evento?.organizadorId;

  if (isLoading) {
    return <div className="text-center p-10">Carregando detalhes do evento...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">Erro ao carregar o evento: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-400">{evento?.titulo}</h1>
                <p className="mt-2 text-lg text-gray-400 capitalize">Categoria: {evento?.categoria}</p>
            </div>
            {isOwner && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/eventos/${eventId}/editar`} className="px-4 py-2 text-base bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-md transition-colors">Editar</Link>
                    <button onClick={handleDelete} disabled={deleteMutation.isPending} className="px-4 py-2 text-base bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors disabled:bg-gray-500">
                        {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            )}
        </div>

        <p className="text-xl text-gray-300 mb-8">{evento?.descricao}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-gray-700 py-8 mb-8 text-lg">
          <div>
            <h3 className="font-bold text-white mb-2">Organizador</h3>
            <p className="text-gray-400">{evento?.organizadorNome}</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Local</h3>
            <p className="text-gray-400">{evento?.local}</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Início do Evento</h3>
            <p className="text-gray-400">{new Date(evento?.dataInicio || '').toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Fim do Evento</h3>
            <p className="text-gray-400">{new Date(evento?.dataFim || '').toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
          <div className="text-2xl font-bold">
            <span className="text-gray-400 mr-2">Preço:</span>
            <span className="text-white">{evento?.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          {isAuthenticated && user?.tipo === 1 && (
            isAlreadyInscrito ? (
              <span className="px-8 py-4 bg-green-700 text-white font-bold rounded-md text-lg">Inscrito ✓</span>
            ) : (
              <button onClick={handleInscricao} disabled={inscricaoMutation.isPending} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed text-lg">
                {inscricaoMutation.isPending ? 'Processando...' : 'Inscrever-se neste Evento'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}