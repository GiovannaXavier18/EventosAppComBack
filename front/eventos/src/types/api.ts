export type TipoUsuario = 0 | 1 | 2;
export type CategoriaEvento = 0 | 1 | 2 | 3 | 4;

export const TIPO_USUARIO_MAP: Record<TipoUsuario, string> = { 0: 'Organizador', 1: 'Participante', 2: 'Admin' };
export const CATEGORIA_EVENTO_MAP: Record<CategoriaEvento, string> = { 0: 'Palestra', 1: 'Show', 2: 'Curso', 3: 'Conferência', 4: 'Outro' };

export interface RegisterPayload { nome: string; email: string; password: string; tipo: TipoUsuario; }
export interface LoginPayload { email: string; password: string; }
export interface EventoPayload { titulo: string; descricao: string; dataInicio: string; dataFim: string; local: string; categoria: CategoriaEvento; preco: number; }
export interface InscricaoPayload { eventoId: number; }
export interface PagamentoPayload { eventoId: number; valor: number; metodoPagamento: string; }

export interface User { id: string; nome: string; Nome: string; email: string; tipo: string; }
export interface AuthResponse { token: string; user: User; }
export interface Evento { id: number; titulo: string; descricao: string; dataInicio: string; dataFim: string; local: string; categoria: string; status: string; organizadorNome: string; organizadorId: string; preco: number; }
export interface MinhaInscricao { id: number; nomeEvento: string; nomeUsuario: string; dataInscricao: string; status: string; }
export interface Pagamento { id: number; eventoId: number; valor: number; status: string; metodoPagamento: string; dataPagamento: string; }