import api from './api';
import type { Evento, EventoPayload } from '../types/api';

export const getEventos = async (): Promise<Evento[]> => {
  const { data } = await api.get<Evento[]>('/Eventos');
  return data;
};

export const getEventoById = async (id: number): Promise<Evento> => {
  const { data } = await api.get<Evento>(`/Eventos/${id}`);
  return data;
};

export const createEvento = (eventoData: EventoPayload): Promise<Evento> => {
  return api.post('/Eventos', eventoData);
};

export const updateEvento = (id: number, eventoData: Partial<EventoPayload>): Promise<Evento> => {
  return api.put(`/Eventos/${id}`, eventoData);
};

export const deleteEvento = (id: number) => {
  return api.delete(`/Eventos/${id}`);
};