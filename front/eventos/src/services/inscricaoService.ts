import api from './api';
import type { InscricaoPayload, MinhaInscricao } from '../types/api';

export const createInscricao = (payload: InscricaoPayload) => {
  return api.post('/Inscricoes', payload);
};

export const getMinhasInscricoes = async (): Promise<MinhaInscricao[]> => {
  const { data } = await api.get<MinhaInscricao[]>('/Inscricoes/minhas-inscricoes');
  return data;
};

export const cancelInscricao = (id: number) => {
  return api.delete(`/Inscricoes/${id}`);
};