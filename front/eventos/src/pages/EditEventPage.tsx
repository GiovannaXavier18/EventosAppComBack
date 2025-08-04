import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventoById, updateEvento } from '../services/eventoService';
import { type CategoriaEvento, CATEGORIA_EVENTO_MAP, type EventoPayload } from '../types/api';

export function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: evento, isLoading: isLoadingEvento } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => getEventoById(eventId),
    enabled: !!eventId,
  });

  const [formData, setFormData] = useState<Partial<EventoPayload>>({});

  useEffect(() => {
    if (evento) {
        const categoriaKey = Object.keys(CATEGORIA_EVENTO_MAP).find(key => 
            CATEGORIA_EVENTO_MAP[key as unknown as CategoriaEvento] === evento.categoria
        ) as unknown as CategoriaEvento;
        setFormData({
            titulo: evento.titulo,
            descricao: evento.descricao,
            local: evento.local,
            dataInicio: evento.dataInicio,
            dataFim: evento.dataFim,
            categoria: categoriaKey || 0,
            preco: evento.preco,
        });
    }
  }, [evento]);

  const mutation = useMutation({
    mutationFn: (updatedData: Partial<EventoPayload>) => updateEvento(eventId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      queryClient.invalidateQueries({ queryKey: ['evento', eventId] });
      navigate(`/eventos/${eventId}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Ocorreu um erro ao atualizar o evento.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumericField = type === 'number' || name === 'categoria';
    setFormData(prev => ({
        ...prev,
        [name]: isNumericField ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isoDate = value ? new Date(value).toISOString() : '';
    setFormData(prev => ({ ...prev, [name]: isoDate }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  const toInputDateTimeLocal = (isoString: string | undefined) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  if (isLoadingEvento) {
    return <div className="text-center p-10">Carregando dados do evento...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10">Editar Evento</h1>
      <form onSubmit={handleSubmit} className="p-10 bg-gray-800 rounded-xl shadow-2xl space-y-8">
        {error && <p className="bg-red-900 border border-red-700 text-white p-4 rounded-md text-center">{error}</p>}
        <div>
          <label htmlFor="titulo" className="block text-gray-300 mb-2 text-lg font-medium">Título do Evento</label>
          <input type="text" name="titulo" id="titulo" value={formData.titulo || ''} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-gray-300 mb-2 text-lg font-medium">Descrição</label>
          <textarea name="descricao" id="descricao" value={formData.descricao || ''} onChange={handleChange} rows={5} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
                <label htmlFor="local" className="block text-gray-300 mb-2 text-lg font-medium">Local</label>
                <input type="text" name="local" id="local" value={formData.local || ''} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
                <label htmlFor="preco" className="block text-gray-300 mb-2 text-lg font-medium">Preço (R$)</label>
                <input type="number" name="preco" id="preco" value={formData.preco || 0} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="0" step="0.01" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label htmlFor="dataInicio" className="block text-gray-300 mb-2 text-lg font-medium">Data e Hora de Início</label>
            <input type="datetime-local" name="dataInicio" id="dataInicio" defaultValue={toInputDateTimeLocal(formData.dataInicio)} onChange={handleDateChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label htmlFor="dataFim" className="block text-gray-300 mb-2 text-lg font-medium">Data e Hora de Fim</label>
            <input type="datetime-local" name="dataFim" id="dataFim" defaultValue={toInputDateTimeLocal(formData.dataFim)} onChange={handleDateChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-gray-300 mb-2 text-lg font-medium">Categoria</label>
          <select name="categoria" id="categoria" value={formData.categoria || 0} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {Object.entries(CATEGORIA_EVENTO_MAP).map(([key, value]) => ( <option key={key} value={key}>{value}</option> ))}
          </select>
        </div>
        <button type="submit" disabled={mutation.isPending} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed text-xl">
          {mutation.isPending ? 'Salvando Alterações...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}