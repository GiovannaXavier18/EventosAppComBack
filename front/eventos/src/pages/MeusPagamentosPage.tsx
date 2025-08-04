import { useQuery } from "@tanstack/react-query";
import { getMeusPagamentos } from "../services/pagamentoService";

export function MeusPagamentosPage() {
    const { data: pagamentos, isLoading, isError, error } = useQuery({
        queryKey: ['meusPagamentos'],
        queryFn: getMeusPagamentos
    });

    if (isLoading) {
        return <div className="text-center p-10">Carregando seus pagamentos...</div>;
    }
    
    if (isError) {
        return <div className="text-center p-10 text-red-500">Ocorreu um erro ao buscar seus pagamentos: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-10">Meus Pagamentos</h1>
            {pagamentos && pagamentos.length > 0 ? (
                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-lg">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="p-5">ID Evento</th>
                                    <th className="p-5 hidden sm:table-cell">Data</th>
                                    <th className="p-5">Valor</th>
                                    <th className="p-5 hidden md:table-cell">Método</th>
                                    <th className="p-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {pagamentos.map(pagamento => (
                                    <tr key={pagamento.id}>
                                        <td className="p-5 font-medium text-white">{pagamento.eventoId}</td>
                                        <td className="p-5 text-gray-300 hidden sm:table-cell">{new Date(pagamento.dataPagamento).toLocaleString('pt-BR')}</td>
                                        <td className="p-5 text-gray-300">{pagamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="p-5 text-gray-300 hidden md:table-cell">{pagamento.metodoPagamento}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 text-base font-semibold rounded-full ${pagamento.status === 'Aprovado' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                                                {pagamento.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 mt-10 bg-gray-800 p-10 rounded-xl">
                    <h2 className="text-2xl font-bold mb-4">Nenhum pagamento encontrado</h2>
                    <p>Seu histórico de pagamentos está vazio.</p>
                </div>
            )}
        </div>
    );
}
