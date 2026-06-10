import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import styles from './Login.module.css';

export function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [erro,     setErro]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const r = await api.post('/auth/login', { email, senha: password });
      login(r.data.user, r.data.token);
      const funcao = r.data.user.funcao?.toLowerCase() ?? '';
      navigate(funcao.includes('gerente') ? '/gerente' : '/agenda');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.body1} page-bg-image`}>
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h1>Login da Equipe</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginTop: '8px' }}>
              Acesso exclusivo para <b>Gerentes</b> e <b>Funcionários</b>.
              <br />Clientes não precisam de conta para agendar serviços.
            </p>
          </div>
          <div className={styles['input-box']}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles['input-box']}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '8px' }}>
              {erro}
            </p>
          )}

          <div className={styles['remember-forgot']}>
            <label><input type="checkbox" /> Lembrar senha</label>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className={styles['register-link']}>
            <p>Não tem uma conta? <Link to="/cadastro-funcionario">Cadastre-se</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
