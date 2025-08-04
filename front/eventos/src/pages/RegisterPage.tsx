import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/authService';
import { TIPO_USUARIO_MAP, type TipoUsuario } from '../types/api';

function validarSenha(senha: string): string | null {
  if (senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
  if (!/[a-z]/.test(senha)) return 'A senha deve conter pelo menos uma letra minúscula.';
  if (!/[A-Z]/.test(senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
  if (!/[^a-zA-Z0-9]/.test(senha)) return 'A senha deve conter pelo menos um caractere especial (ex: @, #, !).';
  return null;
}

export function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const erroSenha = validarSenha(password);
    if (erroSenha) {
      setError(erroSenha);
      return;
    }

    setIsLoading(true);
    try {
      await registerRequest({ nome, email, password, tipo });
      setSuccess('Registro realizado com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError('Email ou senha inválidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-12 sm:mt-16 px-4">
      <form onSubmit={handleSubmit} className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Criar Conta</h2>
        {error && <p className="bg-red-900 border border-red-700 text-white p-4 rounded-md mb-6 text-center">{error}</p>}
        {success && <p className="bg-green-900 border border-green-700 text-white p-4 rounded-md mb-6 text-center">{success}</p>}
        <div className="mb-5">
          <label className="block text-gray-300 mb-2 text-lg font-medium" htmlFor="nome">Nome Completo</label>
          <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        </div>
        <div className="mb-5">
          <label className="block text-gray-300 mb-2 text-lg font-medium" htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        </div>
        <div className="mb-5">
          <label className="block text-gray-300 mb-2 text-lg font-medium" htmlFor="password">Senha</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          <ul className="text-sm text-gray-400 mt-2 list-disc ml-5 space-y-1">
            <li>Mínimo de 6 caracteres</li>
            <li>Pelo menos 1 letra maiúscula</li>
            <li>Pelo menos 1 letra minúscula</li>
            <li>Pelo menos 1 caractere especial (ex: @, #, !)</li>
          </ul>
        </div>
        <div className="mb-8">
          <label className="block text-gray-300 mb-2 text-lg font-medium" htmlFor="tipo">Quero me cadastrar como</label>
          <select id="tipo" value={tipo} onChange={e => setTipo(Number(e.target.value) as TipoUsuario)} className="w-full p-4 text-lg rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {Object.entries(TIPO_USUARIO_MAP).filter(([key]) => Number(key) !== 2).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed text-xl">
          {isLoading ? 'Registrando...' : 'Criar Conta'}
        </button>
        <p className="text-center text-base text-gray-400 mt-8">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:underline">
            Faça o login
          </Link>
        </p>
      </form>
    </div>
  );
}