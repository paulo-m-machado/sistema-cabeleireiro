import React, { useState } from 'react';
import api from '../../api/axios';
import styles from './HistoricoCliente.module.css';

interface Cliente {
  id: number;
  nome: string;
  contato: string;
  descricao?: string;
}

interface Historico {
  id?: number;
  data_atendimento: string;
  profissional: string;
  tipo_servico: string;
  produtos_utilizados?: string;
  marca_tinta?: string;
  formula_coloracao?: string;
  tempo_pausa?: number;
  corte_realizado?: string;
  preferencias?: string;
  observacoes?: string;
  proxima_recomendacao?: string;
}

export function HistoricoCliente() {
  const [pesquisa, setPesquisa] = useState('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState<Partial<Historico>>({});

  async function pesquisar() {
    try {
      setErro('');
      setCliente(null);
      setHistorico([]); // Limpa estados anteriores antes de iniciar uma nova busca

      // 1. Busca a lista geral de clientes no backend
      const { data } = await api.get('/clientes');
      
      const c = data.find((x: Cliente) => 
        x.nome.toLowerCase().includes(pesquisa.toLowerCase()) || 
        x.contato.includes(pesquisa)
      );

      if (c) {
        setCliente(c);
        
        // 2. Tenta buscar o histórico de forma isolada para não quebrar o perfil do cliente
        try {
          const resHist = await api.get(`/historico/${c.id}`);
          setHistorico(resHist.data);
        } catch (histErr) {
          console.error("Erro ao carregar o histórico do cliente:", histErr);
          setErro('Cliente encontrado, mas houve um erro ao carregar o histórico.');
        }

      } else {
        setErro('Cliente não encontrado.');
      }
    } catch (err) {
      console.error("Erro ao conectar com o servidor/buscar clientes:", err);
      setErro('Erro na busca.');
    }
  }

  function handleEdit(hist: Historico) {
    setEditandoId(hist.id ?? null);
    setFormData({ ...hist });
    setModalAberto(true);
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    if (!cliente) return;
    try {
      await api.delete(`/historico/${id}`);
      const resHist = await api.get(`/historico/${cliente.id}`);
      setHistorico(resHist.data);
    } catch (err) {
      alert('Erro ao excluir registro.');
    }
  }

  async function salvarRegistro(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente) return;
    try {
      const body = {
        cliente_id: cliente.id,
        ...formData,
        tempo_pausa: formData.tempo_pausa ? Number(formData.tempo_pausa) : undefined
      };

      if (editandoId) {
        await api.put(`/historico/${editandoId}`, body);
      } else {
        await api.post('/historico', body);
      }

      setModalAberto(false);
      setEditandoId(null);
      setFormData({});
      
      const resHist = await api.get(`/historico/${cliente.id}`);
      setHistorico(resHist.data);
    } catch (err) {
      alert('Erro ao salvar registro.');
    }
  }

  return (
    <div className={`${styles['historico-main']} page-bg-image`}>
      <div className={styles['historico-container']}>
        <div className={styles['historico-header']}>
          <h2>Histórico e Prontuário de Clientes</h2>
          <p>Acesso Restrito: Área exclusiva para profissionais.</p>
          <div className={styles['search-box']}>
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou telefone..." 
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && pesquisar()}
            />
            <button className={styles['btn-pesquisar']} onClick={pesquisar}>Procurar</button>
          </div>
          {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
        </div>

        {cliente && (
          <div className={styles['perfil-cliente']}>
            <div className={styles['perfil-info']}>
              <h3>{cliente.nome}</h3>
              <p><strong>Telefone:</strong> <span>{cliente.contato}</span></p>
              <p><strong>Dermatite/Alergias:</strong> <span className={styles.alerta}>{cliente.descricao || 'Nenhuma'}</span></p>
            </div>
            <div className={styles['perfil-acoes']}>
              <button className={styles['btn-novo']} onClick={() => { setEditandoId(null); setFormData({}); setModalAberto(true); }}>+ Novo Registro</button>
            </div>
          </div>
        )}

        <div className={styles['historico-feed']}>
          {!cliente && (
            <div className={`${styles['historico-card']} ${styles['placeholder-card']}`}>
              <p style={{ textAlign: 'center', color: '#888' }}>Pesquise um cliente para carregar o histórico de atendimentos anteriores.</p>
            </div>
          )}
          {cliente && historico.length === 0 && (
            <div className={`${styles['historico-card']} ${styles['placeholder-card']}`}>
              <p style={{ textAlign: 'center', color: '#888' }}>Nenhum histórico encontrado para este cliente.</p>
            </div>
          )}
          {cliente && historico.map(h => (
            <div key={h.id} className={styles['historico-card']}>
              <div className={styles['card-header']}>
                <span className={styles['data-servico']}>{new Date(h.data_atendimento).toLocaleDateString()}</span>
                <div className={styles['acoes-card']}>
                  <button className={styles['btn-editar']} onClick={() => handleEdit(h)}>Editar</button>
                  <button className={styles['btn-excluir']} onClick={() => handleDelete(h.id!)}>Excluir</button>
                </div>
              </div>
              <div className={styles['card-body']}>
                <p><strong>Profissional:</strong> {h.profissional}</p>
                <p><strong>Serviço:</strong> {h.tipo_servico}</p>
                {h.produtos_utilizados && <p><strong>Produtos:</strong> {h.produtos_utilizados}</p>}
                {h.marca_tinta && <p><strong>Marca da Tinta:</strong> {h.marca_tinta}</p>}
                {h.formula_coloracao && <p><strong>Fórmula:</strong> {h.formula_coloracao}</p>}
                {h.tempo_pausa && <p><strong>Tempo Pausa:</strong> {h.tempo_pausa} min</p>}
                {h.corte_realizado && <p><strong>Corte:</strong> {h.corte_realizado}</p>}
                {h.preferencias && <p><strong>Preferências:</strong> {h.preferencias}</p>}
                {h.proxima_recomendacao && <p><strong>Próxima Recomendação:</strong> {h.proxima_recomendacao}</p>}
                {h.observacoes && <div className={styles['observacao-box']}>{h.observacoes}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalAberto && (
        <div className={styles.modal} style={{ display: 'flex' }}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-header']}>
              <h3>{editandoId ? 'Editar Registro' : 'Novo Registro de Atendimento'}</h3>
              <span className={styles['close-modal']} onClick={() => { setModalAberto(false); setEditandoId(null); setFormData({}); }}>&times;</span>
            </div>
            
            <form onSubmit={salvarRegistro}>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>Data do Atendimento *</label>
                  <input type="date" required value={formData.data_atendimento || ''} onChange={e => setFormData({...formData, data_atendimento: e.target.value})} />
                </div>
                <div className={styles['form-group']}>
                  <label>Profissional Responsável *</label>
                  <input type="text" required value={formData.profissional || ''} onChange={e => setFormData({...formData, profissional: e.target.value})} />
                </div>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Tipo de Serviço Realizado *</label>
                  <input type="text" required value={formData.tipo_servico || ''} onChange={e => setFormData({...formData, tipo_servico: e.target.value})} />
                </div>
                <div className={styles['form-group']}>
                  <label>Produtos Utilizados</label>
                  <input type="text" value={formData.produtos_utilizados || ''} onChange={e => setFormData({...formData, produtos_utilizados: e.target.value})} />
                </div>
                <div className={styles['form-group']}>
                  <label>Marca da Tinta</label>
                  <input type="text" value={formData.marca_tinta || ''} onChange={e => setFormData({...formData, marca_tinta: e.target.value})} />
                </div>
                <div className={styles['form-group']}>
                  <label>Fórmula / Mistura Aplicada</label>
                  <input type="text" value={formData.formula_coloracao || ''} onChange={e => setFormData({...formData, formula_coloracao: e.target.value})} />
                </div>
                <div className={styles['form-group']}>
                  <label>Tempo de Pausa (minutos)</label>
                  <input type="number" value={formData.tempo_pausa || ''} onChange={e => setFormData({...formData, tempo_pausa: Number(e.target.value)})} />
                </div>
                <div className={styles['form-group']}>
                  <label>Detalhes do Corte</label>
                  <input type="text" value={formData.corte_realizado || ''} onChange={e => setFormData({...formData, corte_realizado: e.target.value})} />
                </div>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Preferências do Cliente</label>
                  <input type="text" value={formData.preferencias || ''} onChange={e => setFormData({...formData, preferencias: e.target.value})} />
                </div>
              </div>
              
              <div className={`${styles['form-group']} ${styles['full-width']}`} style={{ marginTop: '15px' }}>
                <label>Observações Importantes / Diagnóstico</label>
                <textarea rows={3} value={formData.observacoes || ''} onChange={e => setFormData({...formData, observacoes: e.target.value})}></textarea>
              </div>
              <div className={`${styles['form-group']} ${styles['full-width']}`} style={{ marginTop: '15px' }}>
                <label>Próxima Recomendação de Serviço</label>
                <input type="text" value={formData.proxima_recomendacao || ''} onChange={e => setFormData({...formData, proxima_recomendacao: e.target.value})} />
              </div>

              <div className={styles['modal-footer']}>
                <button type="button" className={styles['btn-cancelar']} onClick={() => { setModalAberto(false); setEditandoId(null); setFormData({}); }}>Cancelar</button>
                <button type="submit" className={styles['btn-salvar']}>Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}