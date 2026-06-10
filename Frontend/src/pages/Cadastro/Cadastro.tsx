import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Cadastro.module.css';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    setLoading(true);
    try {
      await api.post('/clientes', {
        nome: `${nome} ${sobrenome}`,
        contato: telefone,
        descricao: email // usando descricao para email conforme especificado
      });
      alert('Dados salvos com sucesso! Vamos marcar seu horário.');
      navigate('/agendamento');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.body1} ${styles.container2} page-bg-image`}>
      <div className={`${styles.container} ${styles.container2}`} style={{ height: 'auto', marginTop: '2rem' }}>
        <div className={styles.form}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className={styles['form-header']}>
              <div className={styles.title}>
                <h1>Seus Dados</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginTop: '8px' }}>
                  Preencha para facilitar seu agendamento.
                </p>
              </div>
              <div className={styles['login-button']}>
                <button type="button" onClick={() => navigate('/login')}>
                  Entrar
                </button>
              </div>
            </div>

            <div className={styles['input-group']}>
              <div className={styles['input-box']}>
                <label htmlFor="firstname">Nome:</label>
                <input
                  id="firstname"
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>

              <div className={styles['input-box']}>
                <label htmlFor="lastname">Sobrenome:</label>
                <input
                  id="lastname"
                  type="text"
                  placeholder="Digite seu sobrenome"
                  value={sobrenome}
                  onChange={e => setSobrenome(e.target.value)}
                  required
                />
              </div>

              <div className={styles['input-box']}>
                <label htmlFor="email">E-mail:</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles['input-box']}>
                <label htmlFor="number">Telefone (celular):</label>
                <input
                  id="number"
                  type="tel"
                  placeholder="(xx) xxxxx-xxxx"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  required
                />
              </div>

            </div>

            {erro && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '10px' }}>
                {erro}
              </p>
            )}

            <div className={styles['continue-button']}>
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar e Ir para Agendamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
