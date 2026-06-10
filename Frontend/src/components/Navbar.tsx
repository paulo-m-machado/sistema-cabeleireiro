import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { WhatsAppStatus } from './WhatsAppStatus';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isGerente, logout, user } = useAuth();
  const navigate  = useNavigate();
  const listRef   = useRef<HTMLUListElement>(null);

  // Animar itens do menu mobile (equivalente ao mobile-navbar.js original)
  useEffect(() => {
    const items = listRef.current?.querySelectorAll('li');
    items?.forEach((li, i) => {
      // Only apply mobile animations if the screen is narrow
      if (window.innerWidth <= 999) {
        if (menuOpen) {
          (li as HTMLElement).style.animation = `navLinkFade 0.5s ease forwards ${i / 7 + 0.3}s`;
          (li as HTMLElement).style.opacity = '';
        } else {
          (li as HTMLElement).style.animation = '';
          (li as HTMLElement).style.opacity = '0';
        }
      } else {
        // Ensure desktop always shows items without inline hiding
        (li as HTMLElement).style.animation = '';
        (li as HTMLElement).style.opacity = '';
      }
    });
  }, [menuOpen]);

  // Clean up inline styles on window resize to prevent stuck invisible links
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 999) {
        const items = listRef.current?.querySelectorAll('li');
        items?.forEach(li => {
          (li as HTMLElement).style.animation = '';
          (li as HTMLElement).style.opacity = '';
        });
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function close() { setMenuOpen(false); }

  function handleLogout() {
    logout();
    navigate('/login');
    close();
  }

  return (
    <nav>
      <Link to="/" className="logo" onClick={close}>
        Sebastian Cabelo e Estética
      </Link>

      <div
        className={`mobile-menu ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="line1" />
        <div className="line2" />
        <div className="line3" />
      </div>

      <ul ref={listRef} className={`nav-list ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/"           onClick={close}>Home</Link></li>

        {isAuthenticated && (
          <li><Link to="/servicos"   onClick={close}>Serviços</Link></li>
        )}
        {isAuthenticated && (
          <li><Link to="/agendamento" onClick={close}>Agendamento</Link></li>
        )}

        {isAuthenticated && (
          <li><Link to="/agenda"             onClick={close}>Agenda</Link></li>
        )}
        {isAuthenticated && (
          <li><Link to="/vendas"             onClick={close}>Vendas</Link></li>
        )}
        {isAuthenticated && (
          <li><Link to="/historico-cliente"  onClick={close}>Histórico</Link></li>
        )}
        {isGerente && (
          <li><Link to="/equipe"             onClick={close}>Equipe</Link></li>
        )}
        {isGerente && (
          <li><Link to="/estoque"            onClick={close}>Estoque</Link></li>
        )}
        {isGerente && (
          <li><Link to="/gerente"            onClick={close}>Painel</Link></li>
        )}

        {!isAuthenticated ? (
          <li><Link to="/login" onClick={close}>Login</Link></li>
        ) : (
          <>
            <li><WhatsAppStatus /></li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: 'none', color: '#fff',
                  cursor: 'pointer', letterSpacing: '3px',
                  font: 'inherit', padding: 0,
                }}
              >
                Sair ({user?.nome?.split(' ')[0]})
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
