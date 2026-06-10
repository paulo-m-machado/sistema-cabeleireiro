import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './CadastroFuncionario.module.css';

export function CadastroFuncionario() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [emailContato, setEmailContato] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    try {
      await api.post('/funcionarios', {
        nome: nomeCompleto,
        funcao: areaAtuacao,
        contato: telefone,
        email: emailContato,
        senha: senha,
        dataNascimento: dataNascimento,
        observacoes: observacoes
      });
      setSucesso(true);
      setNomeCompleto('');
      setAreaAtuacao('');
      setEmailContato('');
      setTelefone('');
      setDataNascimento('');
      setObservacoes('');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar funcionário.');
    }
  }

  return (
    <div className={`${styles.body1} ${styles.container2} page-bg-image`}>
      <div className={styles.form}>
        <form id="form-cadastro-funcionario" onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className={styles['form-header']}>
            <div className={styles.title}>
              <h1>Cadastrar Funcionário</h1>
            </div>
          </div>

          {sucesso && (
            <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
              Funcionário cadastrado com sucesso!
            </div>
          )}

          <div className={styles['input-group']}>
            <div className={styles['input-box']}>
              <label htmlFor="nomeCompleto">Nome completo *</label>
              <input 
                id="nomeCompleto" 
                type="text" 
                placeholder="Digite o nome completo"
                value={nomeCompleto}
                onChange={e => setNomeCompleto(e.target.value)}
                required
              />
            </div>

            <div className={styles['input-box']}>
              <label htmlFor="areaAtuacao">Área de atuação / profissão *</label>
              <select 
                id="areaAtuacao" 
                required
                value={areaAtuacao}
                onChange={e => setAreaAtuacao(e.target.value)}
              >
                <option value="" disabled>Selecione a profissão</option>
                <option value="Cabeleireiro(a)">Cabeleireiro(a)</option>
                <option value="Maquiador(a)">Maquiador(a)</option>
                <option value="Esteticista">Esteticista</option>
                <option value="Manicure">Manicure</option>
                <option value="Barbeiro(a)">Barbeiro(a)</option>
                <option value="Designer de sobrancelhas">Designer de sobrancelhas</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className={styles['input-box']}>
              <label htmlFor="emailContato">Email de contato *</label>
              <input 
                id="emailContato" 
                type="email" 
                placeholder="Digite o email" 
                value={emailContato}
                onChange={e => setEmailContato(e.target.value)}
                required 
              />
            </div>

            <div className={styles['input-box']}>
              <label htmlFor="senha">Senha *</label>
              <input 
                id="senha" 
                type="password" 
                placeholder="Digite uma senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required 
                minLength={6}
              />
            </div>

            <div className={styles['input-box']}>
              <label htmlFor="telefone">Telefone / WhatsApp *</label>
              <input 
                id="telefone" 
                type="tel" 
                placeholder="(xx) xxxxx-xxxx" 
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                required 
                maxLength={15}
              />
            </div>

            <div className={styles['input-box']}>
              <label htmlFor="dataNascimento">Data de nascimento (Opcional)</label>
              <input 
                id="dataNascimento" 
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
              />
            </div>

            <div className={styles['input-box']} style={{ width: '100%' }}>
              <label htmlFor="observacoes">Observações (Opcional)</label>
              <textarea 
                id="observacoes" 
                rows={3}
                placeholder="Informações adicionais..."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className={styles['botoes-acao']}>
            <div className={styles['continue-button']} style={{ width: '48%' }}>
              <button type="submit" style={{ width: '100%' }}>Salvar</button>
            </div>
            <div className={styles['cancel-button']} style={{ width: '48%' }}>
              <button type="button" style={{ width: '100%' }} onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </div>
          
          {erro && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '8px', minHeight: '18px' }}>
              {erro}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
