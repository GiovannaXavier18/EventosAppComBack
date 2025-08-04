import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EventosPage } from './pages/EventosPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EditEventPage } from './pages/EditEventPage';
import { MinhasInscricoesPage } from './pages/MinhasInscricoesPage';
import { MeusPagamentosPage } from './pages/MeusPagamentosPage';
import { ProcessarPagamentoPage } from './pages/ProcessarPagamentoPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/eventos/:id" element={<EventDetailsPage />} />
          
          <Route path="/eventos/criar" element={ <ProtectedRoute> <CreateEventPage /> </ProtectedRoute> } />
          <Route path="/eventos/:id/editar" element={ <ProtectedRoute> <EditEventPage /> </ProtectedRoute> } />
          <Route path="/minhas-inscricoes" element={ <ProtectedRoute> <MinhasInscricoesPage /> </ProtectedRoute> } />
          <Route path="/meus-pagamentos" element={ <ProtectedRoute> <MeusPagamentosPage /> </ProtectedRoute> } />
          <Route path="/pagamento/processar/:id" element={ <ProtectedRoute> <ProcessarPagamentoPage /> </ProtectedRoute> } />
          
          <Route path="*" element={<div className="text-center p-10"><h1>404 - Página Não Encontrada</h1></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;