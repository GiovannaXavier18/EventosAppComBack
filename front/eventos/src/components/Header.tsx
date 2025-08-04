import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  const activeLinkClass = "bg-cyan-500 text-white block px-4 py-2 rounded-md text-lg font-medium";
  const defaultLinkClass = "text-gray-300 hover:bg-gray-700 hover:text-white block px-4 py-2 rounded-md text-lg font-medium";

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }
  
  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0">
            <Link to="/" className="text-4xl font-bold text-white">Eventos<span className="text-cyan-400">APP</span></Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass}>Home</NavLink>
              <NavLink to="/eventos" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass}>Eventos</NavLink>
            </div>
          </div>

          <div className="hidden md:flex md:items-center">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
            ) : isAuthenticated ? (
              <div className="ml-4 relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700">
                  <span className="text-white text-lg">Olá, {user?.nome || user?.Nome}</span>
                  <svg className={`w-5 h-5 text-white transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    {user?.tipo === 'Organizador' && <Link to="/eventos/criar" onClick={closeAllMenus} className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100">Criar Evento</Link>}
                    <Link to="/minhas-inscricoes" onClick={closeAllMenus} className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100">Minhas Inscrições</Link>
                    <Link to="/meus-pagamentos" onClick={closeAllMenus} className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100">Meus Pagamentos</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => {logout(); closeAllMenus();}} className="w-full text-left block px-4 py-2 text-base text-gray-700 hover:bg-gray-100">Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-3">
                <Link to="/login" className="px-5 py-3 bg-cyan-500 text-white text-base font-medium rounded-md hover:bg-cyan-600 transition-colors">Login</Link>
                <Link to="/register" className="px-5 py-3 bg-gray-600 text-white text-base font-medium rounded-md hover:bg-gray-700 transition-colors">Registrar</Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Abrir menu</span>
              {isMenuOpen ? ( <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> ) : ( <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg> )}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass} onClick={closeAllMenus}>Home</NavLink>
            <NavLink to="/eventos" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass} onClick={closeAllMenus}>Eventos</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isLoading ? ( <div className="flex justify-center"><div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div></div> ) : isAuthenticated ? (
              <div>
                <div className="flex items-center px-5 mb-3">
                  <div className="ml-3">
                    <div className="text-xl font-medium leading-none text-white">{user?.nome || user?.Nome}</div>
                    <div className="text-base font-medium leading-none text-gray-400">{user?.email}</div>
                  </div>
                </div>
                <div className="px-2 space-y-2 mt-4">
                  {user?.tipo === "Organizador" && <NavLink to="/eventos/criar" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass} onClick={closeAllMenus}>Criar Evento</NavLink>}
                  <NavLink to="/minhas-inscricoes" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass} onClick={closeAllMenus}>Minhas Inscrições</NavLink>
                  <NavLink to="/meus-pagamentos" className={({isActive}) => isActive ? activeLinkClass : defaultLinkClass} onClick={closeAllMenus}>Meus Pagamentos</NavLink>
                  <button onClick={() => {logout(); closeAllMenus();}} className={`${defaultLinkClass} w-full text-left bg-red-800`}>Sair</button>
                </div>
              </div>
            ) : (
              <div className="px-3 space-y-3">
                <Link to="/login" className={`${defaultLinkClass} bg-cyan-600 text-center`} onClick={closeAllMenus}>Login</Link>
                <Link to="/register" className={`${defaultLinkClass} bg-gray-600 text-center`} onClick={closeAllMenus}>Registrar</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
