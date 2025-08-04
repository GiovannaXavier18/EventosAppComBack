import api from './api';
import type { Pagamento, PagamentoPayload } from '../types/api';

export const getMeusPagamentos = async (): Promise<Pagamento[]> => {
    const { data } = await api.get<Pagamento[]>('/Pagamentos/meus-pagamentos');
    return data;
};

export const createPagamento = (payload: PagamentoPayload): Promise<Pagamento> => {
    return api.post('/Pagamentos', payload);
};