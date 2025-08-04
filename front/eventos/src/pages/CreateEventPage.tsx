import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvento } from '../services/eventoService';
import { CATEGORIA_EVENTO_MAP, type EventoPayload } from '../types/api';

export function CreateEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<EventoPayload>({
    titulo: '',
    descricao: '',
    local: '',
    dataInicio: '',
    dataFim: '',
    categoria: 0,
    preco: 0,
  });

  const mutation = useMutation({
    mutationFn: createEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      navigate('/eventos');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'Ocorreu um erro ao criar o evento.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumericField = type === 'number' || name === 'categoria';
    setFormData(prev => ({ ...prev, [name]: isNumericField ? parseFloat(value) || 0 : value }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isoDate = new Date(value).toISOString();
    setFormData(prev => ({ ...prev, [name]: isoDate }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10">Criar Novo Evento</h1>
      <form onSubmit={handleSubmit} className="p-10 bg-gray-800 rounded-xl shadow-2xl space-y-8">
        {error && <p className="bg-red-900 border border-red-700 text-white p-4 rounded-md text-center">{error}</p>}
        <div>
          <label htmlFor="titulo" className="block text-gray-300 mb-2 text-lg font-medium">Título do Evento</label>
          <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-gray-300 mb-2 text-lg font-medium">Descrição</label>
          <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows={5} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label htmlFor="local" className="block text-gray-300 mb-2 text-lg font-medium">Local</label>
            <input type="text" name="local" id="local" value={formData.local} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label htmlFor="preco" className="block text-gray-300 mb-2 text-lg font-medium">Preço (R$)</label>
            <input type="number" name="preco" id="preco" value={formData.preco} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="0" step="0.01" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label htmlFor="dataInicio" className="block text-gray-300 mb-2 text-lg font-medium">Data e Hora de Início</label>
            <input type="datetime-local" name="dataInicio" id="dataInicio" onChange={handleDateChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label htmlFor="dataFim" className="block text-gray-300 mb-2 text-lg font-medium">Data e Hora de Fim</label>
            <input type="datetime-local" name="dataFim" id="dataFim" onChange={handleDateChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-gray-300 mb-2 text-lg font-medium">Categoria</label>
          <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {Object.entries(CATEGORIA_EVENTO_MAP).map(([key, value]) => ( <option key={key} value={key}>{value}</option> ))}
          </select>
        </div>
        <button type="submit" disabled={mutation.isPending} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed text-xl">
          {mutation.isPending ? 'Criando Evento...' : 'Criar Evento'}
        </button>
      </form>
    </div>
  );
}