import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventos } from '../services/eventoService';
import type { Evento } from '../types/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createInscricao, getMinhasInscricoes } from '../services/inscricaoService';

function EventoCard({ evento, onSubscribe, isSubscribed, isParticipant, isSubscribing }: { evento: Evento, onSubscribe: (id: number) => void, isSubscribed: boolean, isParticipant: boolean, isSubscribing: boolean }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
      <Link to={`/eventos/${evento.id}`} className="block p-6 flex-grow">
        <h2 className="text-2xl font-bold text-cyan-400 mb-3">{evento.titulo}</h2>
        <p className="text-gray-300 mb-4 h-24 overflow-y-auto">{evento.descricao}</p>
        <div className="text-2xl font-bold">
            <span className="text-white">{evento?.preco === 0 ? 'Gratuito' : evento?.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      </Link>
      <div className="px-6 pb-6 space-y-3 text-base border-t border-gray-700 pt-4">
        <p><strong>Local:</strong> {evento.local}</p>
        <p><strong>Início:</strong> {new Date(evento.dataInicio).toLocaleString('pt-BR')}</p>
      </div>
      {isParticipant && (
        <div className="px-6 py-4 bg-gray-900 mt-auto">
            {isSubscribed ? (
                <span className="w-full block text-center px-6 py-3 bg-green-700 text-white font-bold rounded-md text-base">Inscrito ✓</span>
            ) : (
                <button onClick={() => onSubscribe(evento.id)} disabled={isSubscribing} className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed text-base">
                    {isSubscribing ? 'Processando...' : 'Inscrever-se'}
                </button>
            )}
        </div>
      )}
    </div>
  );
}

export function EventosPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { data: eventos, isLoading: isLoadingEventos, isError, error } = useQuery({
    queryKey: ['eventos'],
    queryFn: getEventos,
  });

  const { data: minhasInscricoes } = useQuery({
    queryKey: ['minhasInscricoes'],
    queryFn: getMinhasInscricoes,
    enabled: isAuthenticated,
  });

  const inscricaoMutation = useMutation({
    mutationFn: createInscricao,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['minhasInscricoes'] });
      const eventId = variables.eventoId;
      const event = eventos?.find(e => e.id === eventId);
      if (event && event.preco > 0) {
        navigate(`/pagamento/processar/${eventId}`);
      } else {
        alert('Inscrição gratuita realizada com sucesso!');
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Falha na inscrição.');
    },
  });

  const handleSubscribe = (eventoId: number) => {
    inscricaoMutation.mutate({ eventoId });
  }

  if (isLoadingEventos) {
    return <div className="text-center p-10">Carregando eventos...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">Ocorreu um erro ao buscar os eventos: {error.message}</div>;
  }

  const isParticipant = isAuthenticated && user?.tipo === 'Participante';
  const subscribedEventNames = new Set(minhasInscricoes?.map(i => i.nomeEvento));

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10">Eventos Disponíveis</h1>
      {eventos && eventos.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {eventos?.map((evento) => (
            <EventoCard 
              key={evento.id} 
              evento={evento}
              onSubscribe={handleSubscribe}
              isSubscribed={subscribedEventNames.has(evento.titulo)}
              isParticipant={isParticipant}
              isSubscribing={inscricaoMutation.isPending && inscricaoMutation.variables?.eventoId === evento.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-10 bg-gray-800 p-10 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Nenhum evento encontrado</h2>
          <p>Ainda não há eventos disponíveis. Organizadores podem criar um novo evento!</p>
        </div>
      )}
    </div>
  );
}
